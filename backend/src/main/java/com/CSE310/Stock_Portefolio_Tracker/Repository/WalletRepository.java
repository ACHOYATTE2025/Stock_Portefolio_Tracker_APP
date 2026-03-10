package com.CSE310.Stock_Portefolio_Tracker.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet,Long> {

    Wallet findByUserx(Userx userx);


}
