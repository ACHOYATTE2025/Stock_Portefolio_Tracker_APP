package com.CSE310.Stock_Portefolio_Tracker.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Portefolio;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Transactions;

@Repository
public interface TransactionRepository  extends JpaRepository<Transactions,Long>{

    List<Transactions> findByPortfolio(Portefolio portfolio);

}
