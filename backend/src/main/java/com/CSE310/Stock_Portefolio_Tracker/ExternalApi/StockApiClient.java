package com.CSE310.Stock_Portefolio_Tracker.ExternalApi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.CSE310.Stock_Portefolio_Tracker.Dto.GlobalQuoteResponse;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StockApiClient {

    private final WebClient webClient;
    private final String apiKey;

    // Injection via constructeur
    public StockApiClient(WebClient stockWebClient,
                          @Value("${stock.api.api-key}") String apiKey) {
        this.webClient = stockWebClient;
        this.apiKey = apiKey;
    }

    
    @Cacheable("stockPrice")
    public GlobalQuoteResponse getStockPrice(String symbol) {
        log.info("Appel Alpha Vantage pour le symbole : {}", symbol);
        log.info("API Key utilisée : {}", apiKey);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", "GLOBAL_QUOTE")
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(GlobalQuoteResponse.class)
                .block();
    }
}
