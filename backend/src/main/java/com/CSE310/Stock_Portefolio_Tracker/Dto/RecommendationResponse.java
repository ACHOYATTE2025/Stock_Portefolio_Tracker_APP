package com.CSE310.Stock_Portefolio_Tracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationResponse {


    private String portfolioName; // Nom du portfolio
    private String stockSymbol;   // Symbole du stock (ex: AAPL)
    private String advice;        // "BUY", "SELL", "HOLD"
    private String comment;       // Commentaire sur la recommandation
}
