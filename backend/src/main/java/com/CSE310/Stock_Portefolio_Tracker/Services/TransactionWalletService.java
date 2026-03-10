package com.CSE310.Stock_Portefolio_Tracker.Services;

import java.math.BigDecimal;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.CSE310.Stock_Portefolio_Tracker.Dto.WalletTransactDto;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Wallet;
import com.CSE310.Stock_Portefolio_Tracker.Enum.WalletTransaction;
import com.CSE310.Stock_Portefolio_Tracker.Repository.WalletRepository;

import lombok.RequiredArgsConstructor;





@Service
@RequiredArgsConstructor
public class TransactionWalletService {


    private final WalletRepository walletRepository;

    public void walletUses(WalletTransactDto request) {
        Userx userx = (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Wallet wallet = walletRepository.findByUserx(userx);

        if (wallet == null) {
            throw new RuntimeException("Wallet doesn't exist");
        }

        if (request.getTransact() == WalletTransaction.REFUND) {
            wallet.setAmount(wallet.getAmount().add(request.getAmount()));
        } else if (request.getTransact() == WalletTransaction.DROP) {
            if (wallet.getAmount().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("INSUFFICIENT BALANCE");
            }
            wallet.setAmount(wallet.getAmount().subtract(request.getAmount()));
        } else {
            throw new RuntimeException("Unknown wallet transaction type");
        }

        walletRepository.save(wallet);
    }


    //get wallet amount
    public BigDecimal getWallet() {
        Userx userx = (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Wallet wallet = this.walletRepository.findByUserx(userx);
        BigDecimal amount = wallet.getAmount();

        return amount;
    
    }
}


