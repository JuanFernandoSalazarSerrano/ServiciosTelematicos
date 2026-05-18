package com.fsalazar.api.financeinfo.service;

import com.fsalazar.api.financeinfo.domain.Stock;
import com.fsalazar.api.financeinfo.dto.StockRequest;
import com.fsalazar.api.financeinfo.dto.StockResponse;
import com.fsalazar.api.financeinfo.exception.ResourceNotFoundException;
import com.fsalazar.api.financeinfo.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional(readOnly = true)
    public List<StockResponse> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StockResponse getStockById(Long id) {
        Stock stock = getStockEntity(id);
        return toResponse(stock);
    }

    @Transactional
    public StockResponse createStock(StockRequest request) {
        Stock stock = new Stock();
        applyRequest(stock, request);
        Stock saved = stockRepository.save(stock);
        return toResponse(saved);
    }

    @Transactional
    public StockResponse updateStock(Long id, StockRequest request) {
        Stock stock = getStockEntity(id);
        applyRequest(stock, request);
        Stock saved = stockRepository.save(stock);
        return toResponse(saved);
    }

    @Transactional
    public void deleteStock(Long id) {
        Stock stock = getStockEntity(id);
        stockRepository.delete(stock);
    }

    private Stock getStockEntity(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id " + id));
    }

    private void applyRequest(Stock stock, StockRequest request) {
        stock.setSymbol(request.symbol());
        stock.setCompanyName(request.companyName());
        stock.setCurrentPrice(request.currentPrice());
        stock.setSector(request.sector());
    }

    private StockResponse toResponse(Stock stock) {
        return new StockResponse(
                stock.getStockId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                stock.getCurrentPrice(),
                stock.getSector(),
                stock.getCreatedAt()
        );
    }
}
