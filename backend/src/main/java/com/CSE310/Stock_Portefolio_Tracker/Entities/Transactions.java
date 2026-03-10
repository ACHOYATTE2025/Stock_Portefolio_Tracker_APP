package com.CSE310.Stock_Portefolio_Tracker.Entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.CSE310.Stock_Portefolio_Tracker.Enum.TransactionType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@RequiredArgsConstructor
@Setter
@Getter
@Table(name = "transactions")
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity=0;

    @Column(precision = 19, scale = 4)
    private BigDecimal price; // prix unitaire au moment de la transaction

    @Enumerated(EnumType.STRING)
    private TransactionType type; // BUY / SELL

    private LocalDateTime date;

    private BigDecimal totalCost ;

   

    // Relation avec Stock
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    // Relation avec Portfolio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portefolio portfolio;

    @PrePersist
    void onCreate() {
        this.date = LocalDateTime.now();}


}
