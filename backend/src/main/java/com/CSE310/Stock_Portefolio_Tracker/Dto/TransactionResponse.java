package com.CSE310.Stock_Portefolio_Tracker.Dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class TransactionResponse {


    private String symbol;
    private int quantity;
    private BigDecimal price;
    private String type;
}
