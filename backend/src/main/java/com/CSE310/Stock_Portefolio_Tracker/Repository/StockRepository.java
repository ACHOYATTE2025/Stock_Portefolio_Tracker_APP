package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Stock;



@Repository
public interface StockRepository extends JpaRepository<Stock,Long>{

    Optional<Stock> findBySymbol(String symbol);

}
