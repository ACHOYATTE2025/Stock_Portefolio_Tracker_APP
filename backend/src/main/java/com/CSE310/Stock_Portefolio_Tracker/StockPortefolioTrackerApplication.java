package com.CSE310.Stock_Portefolio_Tracker;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Stock;
import com.CSE310.Stock_Portefolio_Tracker.Repository.StockRepository;

import lombok.AllArgsConstructor;


@SpringBootApplication
@AllArgsConstructor
@EnableCaching
public class StockPortefolioTrackerApplication   implements CommandLineRunner  {

	private final StockRepository stockRepository;

	public static void main(String[] args) {
		SpringApplication.run(StockPortefolioTrackerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		 // Vérifier si les stocks existent déjà
          if (stockRepository.count() == 0) {
            List<Stock> stocks = List.of(
              new Stock(null, "AAPL", "Apple Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "TSLA", "Tesla Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "GOOGL", "Alphabet Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "AMZN", "Amazon.com Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "MSFT", "Microsoft Corp.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "NFLX", "Netflix Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "FB", "Meta Platforms", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "NVDA", "NVIDIA Corp.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "BABA", "Alibaba Group", "NYSE", BigDecimal.ZERO),
new Stock(null, "INTC", "Intel Corp.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "AMD", "Advanced Micro Devices", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "ORCL", "Oracle Corp.", "NYSE", BigDecimal.ZERO),
new Stock(null, "IBM", "IBM Corp.", "NYSE", BigDecimal.ZERO),
new Stock(null, "ADBE", "Adobe Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "PYPL", "PayPal Holdings", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "CRM", "Salesforce Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "UBER", "Uber Technologies", "NYSE", BigDecimal.ZERO),
new Stock(null, "LYFT", "Lyft Inc.", "NASDAQ", BigDecimal.ZERO),
new Stock(null, "SHOP", "Shopify Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "SQ", "Block Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "TWTR", "Twitter Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "SNAP", "Snap Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "SPOT", "Spotify Technology", "NYSE", BigDecimal.ZERO),
new Stock(null, "DIS", "Disney", "NYSE", BigDecimal.ZERO),
new Stock(null, "BA", "Boeing", "NYSE", BigDecimal.ZERO),
new Stock(null, "GM", "General Motors", "NYSE", BigDecimal.ZERO),
new Stock(null, "F", "Ford Motor Co.", "NYSE", BigDecimal.ZERO),
new Stock(null, "V", "Visa Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "MA", "Mastercard Inc.", "NYSE", BigDecimal.ZERO),
new Stock(null, "KO", "Coca-Cola Co.", "NYSE", BigDecimal.ZERO)
            );

            stockRepository.saveAll(stocks);
        }

        System.out.println("30 stocks initialisés !");
	}

}
