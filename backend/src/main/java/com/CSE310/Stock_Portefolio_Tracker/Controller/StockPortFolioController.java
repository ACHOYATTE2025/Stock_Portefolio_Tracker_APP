package com.CSE310.Stock_Portefolio_Tracker.Controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CSE310.Stock_Portefolio_Tracker.Dto.GlobalQuoteResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.PortfolioResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.ResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.WalletTransactDto;


import com.CSE310.Stock_Portefolio_Tracker.Services.PortefolioService;
import com.CSE310.Stock_Portefolio_Tracker.Services.TransactionWalletService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // autorise ton frontend
@AllArgsConstructor
@Slf4j

@Tag(
  name = "Stock & PortFolio Controller",
  description="STOCK CONTROLLER  Api in Stock tracker management APP to get  details"
)
public class StockPortFolioController {

    private final PortefolioService portfolioService;
    



    
          
//Get Stock Info
  @Operation(
    summary="REST API to get Stock's Informations",
    description = "REST API to get Stock's information in  Stock tracker management APP "
  )

  @ApiResponse(
    responseCode="200",
    description = "INFORMATION DONE"
  )
    @GetMapping("/{symbol}")
    public GlobalQuoteResponse getStock(@PathVariable String symbol) {
        return portfolioService.getStockInfo(symbol);
    }



          
//Get value of stock
  @Operation(
    summary="REST API to get value of Stock",
    description = "REST API to cget value  inside Stock  "
  )

  @ApiResponse(
    responseCode="200",
    description = "VALUE DONE"
  )
        @GetMapping("value/{symbol}/{quantity}")
        public BigDecimal getStockValue(
                @PathVariable String symbol,
                @PathVariable int quantity) {

            return portfolioService.getCurrentValue(symbol, quantity);
        }


        @PostMapping("/createPortefolio")
        public ResponseEntity<ResponseDto> createPortfolio( @RequestParam String porteFolioName) {

             portfolioService.createPortfolio(porteFolioName);

             return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ResponseDto(201,"PORTEFOLIO CREATED","STOCK DONE"));
       

    }
        
    //Get folio by name or all folio
    @Operation(
        summary="REST API to get portefolio by name or all portefolio P",
        description = "REST API to get portfolio inside Stock Portefolio App "
      )
     @ApiResponse(
      responseCode="200",
      description = "VALUE DONE"
  )
    @GetMapping(path="/getPortfolio")
    public List<PortfolioResponse>  getMyPortfolio(@RequestParam(required = false)  String num){

        List<PortfolioResponse> readix = this.portfolioService.getPortfolio(num);
        log.info("certificate fetch N° "+ readix);
        return readix;
    }




    //get a portefolio by ID
    @Operation(
        summary="REST API to get portfolio by ID",
        description = "REST API to get Portfolio y id inside Stock portfolio App "
      )
      @ApiResponse(
      responseCode="200",
      description = "VALUE DONE"
  )
    @GetMapping(path="/getPortefolio/{id}")
    Optional<PortfolioResponse> GetPortfolioById(@Valid @RequestParam(required = true)Long id ){
      Optional<PortfolioResponse> bix = this.portfolioService.getBirthById(id);
      log.info("Portofolio fetch by id N° "+ bix);
      return bix;
    }


    

  //suprimmer un portefolio
  @Operation(
      summary="REST API to delete Portfolio  into APP ",
      description = "REST API to delete  Portfolio inside  App "
    )
  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping(path="/portfoliodeletion")
  private  ResponseEntity<ResponseDto>  portfolioDeletion(@RequestParam(required = false)  String num){
      ResponseEntity<ResponseDto> portfoliodelete= this.portfolioService.portfoliodeletion(num);
      log.info("Portfolio deleted  "+ portfoliodelete.getBody());
      return portfoliodelete;
  }





}
