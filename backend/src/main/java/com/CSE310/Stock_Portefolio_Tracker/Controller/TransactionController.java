package com.CSE310.Stock_Portefolio_Tracker.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CSE310.Stock_Portefolio_Tracker.Dto.ResponseDto;
import com.CSE310.Stock_Portefolio_Tracker.Dto.TransactionRequest;
import com.CSE310.Stock_Portefolio_Tracker.Dto.TransactionResponse;
import com.CSE310.Stock_Portefolio_Tracker.Dto.WalletTransactDto;

import com.CSE310.Stock_Portefolio_Tracker.Repository.WalletRepository;
import com.CSE310.Stock_Portefolio_Tracker.Services.TransactionService;
import com.CSE310.Stock_Portefolio_Tracker.Services.TransactionWalletService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j

public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionWalletService transactionWalletService;
    private final WalletRepository walletRepository;

    @PostMapping(path="/transactions")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse transaction = transactionService.executeTransaction(request);
        return ResponseEntity.ok(transaction);
    }


    
  

    //REFUND OR DROP A WALLET
    @Operation(
        summary="REST API to REFUND OR DROP WALLET",
        description = "REST API to  REFUND OR DROP WALLET inside Stock portfolio App "
      )
      @ApiResponse(
      responseCode="200",
      description = "VALUE DONE"
  )
    @PostMapping(path="/Wallet")
    ResponseEntity<?> useWallet(@RequestBody @Valid WalletTransactDto request ){
      this.transactionWalletService.walletUses(request);

      log.info("Portofolio fetch by id N° "+ request.getTransact());
      return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ResponseDto(201,request.getTransact().toString(),"STOCK DONE"));
    }



      //GET  WALLET AMOUNT
    @Operation(
        summary="REST API to REFUND OR DROP WALLET",
        description = "REST API to  REFUND OR DROP WALLET inside Stock portfolio App "
      )
      @ApiResponse(
      responseCode="200",
      description = "VALUE DONE"
  )
    @GetMapping(path="/walletAmount")
    BigDecimal getWalletAmonut(){
        BigDecimal amount = this.transactionWalletService.getWallet();
        return amount;
      
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions() {
        return ResponseEntity.ok(transactionService.getTransactionsByUser());
    }

}
