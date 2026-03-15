package com.CSE310.Stock_Portefolio_Tracker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;




import lombok.AllArgsConstructor;


@SpringBootApplication
@AllArgsConstructor
@EnableCaching
public class StockPortefolioTrackerApplication     {

	

	public static void main(String[] args) {
		SpringApplication.run(StockPortefolioTrackerApplication.class, args);
	}


}
