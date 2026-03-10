package com.CSE310.Stock_Portefolio_Tracker.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.AllArgsConstructor;


@Configuration
@AllArgsConstructor
public class WebClientConfig {

    @Bean
    public WebClient stockWebClient(@Value("${stock.api.base-url}") String baseUrl) {

        return  WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
