package com.CSE310.Stock_Portefolio_Tracker.Entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String advice; // BUY, SELL, HOLD
    private String comment;

    private LocalDateTime date;

    // Prix d'achat
    private BigDecimal buyPrice;

    // Prix actuel venant de l'API
    @Transient
    private BigDecimal currentPrice;

    // Gain ou perte
    @Transient
    private BigDecimal gainLoss;

    // Pourcentage variation
    @Transient
    private BigDecimal percentageChange;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;
}