package com.CSE310.Stock_Portefolio_Tracker.Dto;
import com.CSE310.Stock_Portefolio_Tracker.Enum.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class TransactionRequest {

    private String porteFolioName;
    private String symbol;     // ex: "AAPL"
    private int quantity;
    private TransactionType type; // BUY ou SELL
  
}
