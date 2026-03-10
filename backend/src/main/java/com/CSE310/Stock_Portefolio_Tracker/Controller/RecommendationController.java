package com.CSE310.Stock_Portefolio_Tracker.Controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CSE310.Stock_Portefolio_Tracker.Dto.RecommendationResponse;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Holding;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Portefolio;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Recommendation;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Stock;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Repository.HoldingRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.PortefolioRepository;
import com.CSE310.Stock_Portefolio_Tracker.Repository.StockRepository;
import com.CSE310.Stock_Portefolio_Tracker.Services.RecommendationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class RecommendationController {

   
    private final RecommendationService recommendationService;
    private final HoldingRepository holdingRepository;
    private final PortefolioRepository portefolioRepository;
    private final StockRepository stockRepository;

   @GetMapping("/{portfolioName}/{stockSymbol}")
public RecommendationResponse getRecommendation(@PathVariable String portfolioName,
                                                @PathVariable String stockSymbol){


    Userx usex = (Userx) SecurityContextHolder.getContext().getAuthentication().getPrincipal();  
    Portefolio portfolio = portefolioRepository.findByNamePortefolioAndUser(portfolioName,usex)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));

    Stock stock = stockRepository.findBySymbol(stockSymbol)
            .orElseThrow(() -> new RuntimeException("Stock not found"));

    Holding holding = holdingRepository.findByPortfolioAndStock(portfolio, stock)
            .orElseThrow(() -> new RuntimeException("Holding not found"));

    Recommendation recommendation = recommendationService.generateRecommendation(holding);

    return new RecommendationResponse(
            portfolio.getNamePortefolio(),
            stock.getSymbol(),
            recommendation.getAdvice(),
            recommendation.getComment()
    );
}

}


