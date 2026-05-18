package com.fsalazar.api.financeinfo.controller;

import com.fsalazar.api.financeinfo.dto.StockRequest;
import com.fsalazar.api.financeinfo.dto.StockResponse;
import com.fsalazar.api.financeinfo.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<StockResponse>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockResponse> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    @PostMapping
    public ResponseEntity<StockResponse> createStock(@Valid @RequestBody StockRequest request) {
        StockResponse created = stockService.createStock(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockResponse> updateStock(@PathVariable Long id,
                                                     @Valid @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockService.updateStock(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}
