package com.CSE310.Stock_Portefolio_Tracker.Services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.CSE310.Stock_Portefolio_Tracker.Dto.GlobalQuoteResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.HoldingResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.PortfolioResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.ResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Holding;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Portefolio;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Wallet;
import com.CSE310.Stock_Portefolio_Tracker.ExternalApi.StockApiClient;
import com.CSE310.Stock_Portefolio_Tracker.Repository.PortefolioRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.UserxRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.WalletRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;

@Service
@AllArgsConstructor
@Slf4j
public class PortefolioService {
    private final StockApiClient stockApiClient;
    private final UserxRepository userxRepository;
    private final PortefolioRepository portefolioRepository;
    private final WalletRepository walletRepository;
    
    

 

    
     //Create a portefolio
     public void createPortfolio( String portfolioName) {
        Userx userx =   (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional <Portefolio> existingPortfolio =
                    portefolioRepository.findByNamePortefolioAndUser(portfolioName, userx);

            if (!existingPortfolio.isEmpty()) {
                throw new RuntimeException("Portfolio already exists!");
            }

            Wallet wallet = this.walletRepository.findByUserx(userx);
            if(wallet.equals(null)){throw new RuntimeException("WALLET Doesn't exit !!!");}

            Portefolio newPortfolio = new Portefolio();
            newPortfolio.setNamePortefolio(portfolioName);
            newPortfolio.setUser(userx);
            newPortfolio.setWallet(wallet);

            portefolioRepository.save(newPortfolio);   
            

       
         }
         

    //Get value of stock
     public BigDecimal getCurrentValue(String symbol, int quantity) {
        GlobalQuoteResponse response = stockApiClient.getStockPrice(symbol);
        BigDecimal price = new BigDecimal(response.getQuote().getPrice());
        return price.multiply(BigDecimal.valueOf(quantity));
    }


   //get Info of Stock 
     public GlobalQuoteResponse getStockInfo(String symbol) {
       GlobalQuoteResponse response = stockApiClient.getStockPrice(symbol);

        // Sécurité : Alpha Vantage peut renvoyer une réponse vide
        if (response == null ||
            response.getQuote() == null ||
            response.getQuote().getPrice() == null) {

            throw new RuntimeException(
                    "Stock introuvable ou données indisponibles pour le symbole : " + symbol
            );
        }

        return response;
     }


    
    //Maping from Portfolio to PortefolioResponse
    private PortfolioResponse mapToDto(Portefolio portfolio) {
        List<HoldingResponse> holdings = portfolio.getHoldings().stream()
                .map(this::mapHoldingToDto)
                .toList();

        return new PortfolioResponse(
                portfolio.getId(),
                portfolio.getNamePortefolio(),
                holdings
        );
    }


    
    //Maping to holding to HoldingResponse
    private HoldingResponse mapHoldingToDto(Holding holding) {
          GlobalQuoteResponse quote = stockApiClient.getStockPrice(
            holding.getStock().getSymbol()
    );

    BigDecimal currentPrice = BigDecimal.ZERO;

    if (quote != null && quote.getQuote() != null && quote.getQuote().getPrice() != null) {

        currentPrice = new BigDecimal(quote.getQuote().getPrice());

    } else {

        log.warn("Stock price not available for {}", holding.getStock().getSymbol());

    }

    BigDecimal totalPrice = currentPrice.multiply(BigDecimal.valueOf(holding.getQuantity()));

    holding.getStock().setCurrentPrice(currentPrice);
    holding.setAmount(totalPrice);
    holding.getStock().setCurrentPrice(currentPrice);

    return new HoldingResponse(
            holding.getStock().getSymbol(),
            holding.getStock().getName(),
            holding.getAmount(),
            holding.getQuantity(),
            holding.getStock().getCurrentPrice()
    );
    }



    // get portfolio
   public List<PortfolioResponse> getPortfolio(String num) {

             Userx user = (Userx) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();

    if (Strings.isNotEmpty(num)) {

        Portefolio portfolio = portefolioRepository
                .findByNamePortefolioAndUser(num, user)
                .orElseThrow(() -> new RuntimeException("PORTFOLIO DOESN'T EXIST"));
  
        return List.of(mapToDto(portfolio));
    }

    List<Portefolio> portfolios = portefolioRepository.findAllByUser(user);

    if (portfolios.isEmpty()) {
        throw new RuntimeException("NOTHING TO SHOW");
    }
  
    return portfolios.stream()
            .map(this::mapToDto)
            .toList();
        }



    //get portfolio by Id
        public Optional<PortfolioResponse> getBirthById(Long id) {
            
            if(id==null){throw new RuntimeException("ID none enter");}
            Optional<Portefolio> portofo = this.portefolioRepository.findById(id);
            if(portofo.isEmpty()){throw new RuntimeException("PORTFOLIO DOESN'T EXIST!!!");}

            Optional<PortfolioResponse> alex=  portofo.stream().map(this::mapToDto).findFirst();
            return alex;
            }




    //portfolio deletion   
        @Transactional
        public ResponseEntity<ResponseDto> portfoliodeletion(String num) {
            Userx usex = (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();  
            Optional<Portefolio> DEXO = this.portefolioRepository.findByNamePortefolioAndUser(num,usex);

            if(DEXO== null){
                throw new RuntimeException( "DELETION IMPOSSIBLE") ;
            }else{
                this.portefolioRepository.delete(DEXO.get());
            }
            
             
 
            log.info("XTRAIT :"+DEXO);
     

            return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseDto(406, "PORTEFOLIO ° "+DEXO.get().getNamePortefolio() +" A ETE SUPPRIME" ,"DONE"));
           
        }

}
