package com.CSE310.Stock_Portefolio_Tracker.Dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalQuoteResponse {

    @JsonProperty("Global Quote")
    private Quote quote;

    @Data
    @Getter
    @NoArgsConstructor
    public static class Quote {
        @JsonProperty("01. symbol")
        private String symbol;

        @JsonProperty("02. open")
        private BigDecimal open;

        @JsonProperty("03. high")
        private BigDecimal high;

        @JsonProperty("04. low")
        private BigDecimal low;

       @JsonProperty("05. price")
        private String price;

        @JsonProperty("06. volume")
        private Long volume;

        @JsonProperty("07. latest trading day")
        private LocalDate latestTradingDay;

        @JsonProperty("08. previous close")
        private BigDecimal previousClose;

        @JsonProperty("09. change")
        private BigDecimal change;

        @JsonProperty("10. change percent")
        private String changePercent;
    }

}
