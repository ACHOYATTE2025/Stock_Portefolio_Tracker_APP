package com.CSE310.Stock_Portefolio_Tracker.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Setter;

@Data
@Setter
@AllArgsConstructor
public class PortfolioResponse {
    private Long id;
    private String name;
    private  List<HoldingResponse> holdings;

}
