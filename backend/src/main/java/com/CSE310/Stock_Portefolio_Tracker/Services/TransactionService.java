package com.CSE310.Stock_Portefolio_Tracker.Services;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.CSE310.Stock_Portefolio_Tracker.Dto.GlobalQuoteResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.TransactionRequest;
import com.CSE310.Stock_Portefolio_Tracker.Dto.TransactionResponse;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Holding;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Portefolio;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Stock;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Transactions;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Wallet;
import com.CSE310.Stock_Portefolio_Tracker.Enum.TransactionType;
import com.CSE310.Stock_Portefolio_Tracker.ExternalApi.StockApiClient;
import com.CSE310.Stock_Portefolio_Tracker.Repository.HoldingRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.PortefolioRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.StockRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.TransactionRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.UserxRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.WalletRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor

@Slf4j
public class TransactionService {
    private final TransactionRepository transactionsRepository;
    private final HoldingRepository holdingRepository;
    private final StockRepository stockRepository;
    private final PortefolioRepository portefolioRepository;
    private final UserxRepository userxRepository;
    private final StockApiClient stockApiClient;
    private final WalletRepository walletRepository;

    @Transactional
    public TransactionResponse executeTransaction(TransactionRequest request) {

        // 1️⃣ Récupérer utilisateur connecté
        Userx userx = (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Wallet wallet = walletRepository.findByUserx(userx);
        if (wallet == null) {
            throw new RuntimeException("WALLET NOT FOUND");
        }

        // 2️⃣ Récupérer portfolio du user
        // Par celle-ci
        Portefolio portfolio = portefolioRepository
                .findByNamePortefolioAndUser(request.getPorteFolioName(), userx)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        // 3️⃣ Récupérer stock via SYMBOL
        Stock stock = stockRepository.findBySymbol(request.getSymbol())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        // 4️⃣ Prix réel via API
        
        GlobalQuoteResponse response = stockApiClient.getStockPrice(stock.getSymbol());
        if (response == null || response.getQuote() == null) {
            throw new RuntimeException("Stock price unavailable from API");
        }
        BigDecimal price = new BigDecimal(response.getQuote().getPrice());

        // 5️⃣ Récupérer ou créer holding
        Holding holding = holdingRepository
                .findByPortfolioAndStock(portfolio, stock)
                .orElseGet(() -> {
                    Holding newHolding = new Holding();
                    newHolding.setPortfolio(portfolio);
                    newHolding.setStock(stock);
                    newHolding.setAmount(BigDecimal.valueOf(0.0));
                    newHolding.setQuantity(0);
                    return newHolding;
                });

        // 6️⃣ Logique BUY / SELL
        if (request.getType() == TransactionType.BUY) {
            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(request.getQuantity()));

            // Vérifier si le wallet a assez d'argent
            if (wallet.getAmount().compareTo(totalPrice) < 0) {
                throw new RuntimeException("INSUFFICIENT BALANCE");
            }

            // Déduire le montant
            wallet.setAmount(wallet.getAmount().subtract(totalPrice));
            walletRepository.save(wallet);

            // Ajouter les actions au holding
            holding.setQuantity(holding.getQuantity() + request.getQuantity());
            holding.setWallet(wallet);
            holding.setAmount(totalPrice);
            holding.setBuyPrice(price);
            holdingRepository.save(holding);

        } else if (request.getType() == TransactionType.SELL) {
            if (holding.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Not enough shares to sell");
            }

            // Calcul du montant total de la vente
            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(request.getQuantity()));

            // Ajouter le montant au wallet
            wallet.setAmount(wallet.getAmount().add(totalPrice));
            walletRepository.save(wallet);

            // Retirer les actions du holding
            holding.setQuantity(holding.getQuantity() - request.getQuantity());
            if (holding.getQuantity() == 0) {
                holdingRepository.delete(holding);
            } else {
                holdingRepository.save(holding);
            }
        }

        // 7️⃣ Enregistrer transaction
        Transactions transaction = new Transactions();
        transaction.setPortfolio(portfolio);
        transaction.setStock(stock);
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(price);
        transaction.setTotalCost( price.multiply(BigDecimal.valueOf(request.getQuantity())));
        transaction.setType(request.getType());
        Transactions saved = transactionsRepository.save(transaction);

        return new TransactionResponse(
                saved.getStock().getSymbol(),
                saved.getQuantity(),
                saved.getPrice(),
                saved.getType().name()
        );
    }




    //get transactions
    public List<TransactionResponse> getTransactionsByUser() {
        Userx userx = (Userx) SecurityContextHolder.getContext()
                            .getAuthentication().getPrincipal();

        // Si plusieurs portfolios par user, récupérez tous
        List<Portefolio> portfolios = portefolioRepository.findAllByUser(userx);

        return portfolios.stream()
            .flatMap(portfolio -> transactionsRepository.findByPortfolio(portfolio).stream())
            .map(tx -> new TransactionResponse(
                tx.getStock().getSymbol(),
                tx.getQuantity(),
                tx.getPrice(),
                tx.getType().name()
            ))
            .collect(Collectors.toList());
        }
}
