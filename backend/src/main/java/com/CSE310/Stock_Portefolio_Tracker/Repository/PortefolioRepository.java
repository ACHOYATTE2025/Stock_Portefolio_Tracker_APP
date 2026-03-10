package com.CSE310.Stock_Portefolio_Tracker.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CSE310.Stock_Portefolio_Tracker.Entities.Portefolio;
import com.CSE310.Stock_Portefolio_Tracker.Entities.Userx;

import java.util.List;
import java.util.Optional;


@Repository
public interface PortefolioRepository extends JpaRepository<Portefolio,Long>{


      // Lister tous les portefeuilles d'un utilisateur
        List<Portefolio> findAllByUser(Userx usex);


          
      

      //find by num et user connected
       
       Optional <Portefolio> findByNamePortefolioAndUser(String namePortefolio,Userx userx);


   


       void delete(Portefolio portefolio);


       Optional <Portefolio> findByUser(Userx user);

}
