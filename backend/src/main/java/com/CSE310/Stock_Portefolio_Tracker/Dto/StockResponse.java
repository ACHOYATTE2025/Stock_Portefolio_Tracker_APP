package com.CSE310.Stock_Portefolio_Tracker.Dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class StockResponse {
     String symbol;
    String name;
    String exchange;
    BigDecimal currentPrice;

}
