package com.CSE310.Stock_Portefolio_Tracker.Services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.CSE310.Stock_Portefolio_Tracker.Dto.GlobalQuoteResponse;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Holding;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Recommendation;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Stock;
import com.CSE310.Stock_Portefolio_Tracker.ExternalApi.StockApiClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final StockApiClient stockApiClient;

    public Recommendation generateRecommendation(Holding holding) {

        Stock stock = holding.getStock();
        BigDecimal buyPrice = holding.getBuyPrice();

        GlobalQuoteResponse response = stockApiClient.getStockPrice(stock.getSymbol());

        BigDecimal currentPrice = null;

        if (response != null && response.getQuote() != null && response.getQuote().getPrice() != null) {
            currentPrice = new BigDecimal(response.getQuote().getPrice());
        }

        Recommendation recommendation = new Recommendation();

        recommendation.setStock(stock);
        recommendation.setBuyPrice(buyPrice);
        recommendation.setDate(LocalDateTime.now());

        if (currentPrice == null) {
            recommendation.setAdvice("UNKNOWN");
            recommendation.setComment("Impossible de récupérer le prix actuel");
            return recommendation;
        }

        recommendation.setCurrentPrice(currentPrice);

        // Gain / lost
        BigDecimal gainLoss = currentPrice.subtract(buyPrice);
        recommendation.setGainLoss(gainLoss);

        // Pourcentage
        BigDecimal change = gainLoss
                .divide(buyPrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        recommendation.setPercentageChange(change);

        String advice;

        if (change.compareTo(BigDecimal.valueOf(10)) > 0) {
            advice = "SELL";
        } 
        else if (change.compareTo(BigDecimal.valueOf(-10)) < 0) {
            advice = "BUY";
        } 
        else {
            advice = "HOLD";
        }

        recommendation.setAdvice(advice);

        String comment = String.format(
                "Prix d'achat : %s$  | Prix actuel : %s$ | Variation : %s%%| Conseil : %s",
                buyPrice,
                currentPrice,
                change.setScale(2, RoundingMode.HALF_UP),
                advice
        );

        recommendation.setComment(comment);

        return recommendation;
    }
}