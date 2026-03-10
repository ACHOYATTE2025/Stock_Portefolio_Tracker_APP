package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Holding;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Portefolio;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Stock;

@Repository
public interface HoldingRepository extends JpaRepository<Holding,Long>{

    Optional<Holding> findByPortfolioAndStock(Portefolio portfolio, Stock stock);

     Optional<Holding> findByPortfolioIdAndStockId(Long portfolioId, Long stockId);

}
