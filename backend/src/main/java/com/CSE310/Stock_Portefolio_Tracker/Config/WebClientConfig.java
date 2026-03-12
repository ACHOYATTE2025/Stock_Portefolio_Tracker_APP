package com.CSE310.Stock_Portefolio_Tracker.Config;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.netty.http.client.HttpClient;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import lombok.AllArgsConstructor;


@Configuration
@AllArgsConstructor
public class WebClientConfig {

    @Bean
    public WebClient stockWebClient(@Value("${stock.api.base-url}") String baseUrl) {

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 30000)
                .responseTimeout(Duration.ofSeconds(30))
                .doOnConnected(conn ->
                    conn.addHandlerLast(new ReadTimeoutHandler(30, TimeUnit.SECONDS))
                );

        return WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
