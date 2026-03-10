package com.CSE310.Stock_Portefolio_Tracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;


@Data
@AllArgsConstructor
@Getter
public class ResponseDto {

 

  private int statusCode;

  private String statusMsg;

  private String msg;


}
