package com.CSE310.Stock_Portefolio_Tracker.Dto;

import java.math.BigDecimal;

import com.CSE310.Stock_Portefolio_Tracker.Enum.WalletTransaction;

import lombok.Data;

@Data
public class WalletTransactDto {

    private WalletTransaction transact;
    private BigDecimal amount;

}
