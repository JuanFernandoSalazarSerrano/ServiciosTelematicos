package com.fsalazar.api.financeinfo.controller;

import com.fsalazar.api.financeinfo.dto.PortfolioRequest;
import com.fsalazar.api.financeinfo.dto.PortfolioResponse;
import com.fsalazar.api.financeinfo.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<List<PortfolioResponse>> getAllPortfolios() {
        return ResponseEntity.ok(portfolioService.getAllPortfolios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> getPortfolioById(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.getPortfolioById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<PortfolioResponse>> getPortfoliosByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(portfolioService.getPortfoliosByClientId(clientId));
    }

    @PostMapping
    public ResponseEntity<PortfolioResponse> createPortfolio(@Valid @RequestBody PortfolioRequest request) {
        PortfolioResponse created = portfolioService.createPortfolio(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioResponse> updatePortfolio(@PathVariable Long id,
                                                             @Valid @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.updatePortfolio(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }
}
