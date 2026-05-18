package com.fsalazar.api.financeinfo.service;

import com.fsalazar.api.financeinfo.domain.Client;
import com.fsalazar.api.financeinfo.domain.ClientPortfolio;
import com.fsalazar.api.financeinfo.domain.Stock;
import com.fsalazar.api.financeinfo.dto.PortfolioRequest;
import com.fsalazar.api.financeinfo.dto.PortfolioResponse;
import com.fsalazar.api.financeinfo.exception.ResourceNotFoundException;
import com.fsalazar.api.financeinfo.repository.ClientPortfolioRepository;
import com.fsalazar.api.financeinfo.repository.ClientRepository;
import com.fsalazar.api.financeinfo.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PortfolioService {

    private final ClientPortfolioRepository portfolioRepository;
    private final ClientRepository clientRepository;
    private final StockRepository stockRepository;

    public PortfolioService(ClientPortfolioRepository portfolioRepository,
                            ClientRepository clientRepository,
                            StockRepository stockRepository) {
        this.portfolioRepository = portfolioRepository;
        this.clientRepository = clientRepository;
        this.stockRepository = stockRepository;
    }

    @Transactional(readOnly = true)
    public List<PortfolioResponse> getAllPortfolios() {
        return portfolioRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolioById(Long id) {
        ClientPortfolio portfolio = getPortfolioEntity(id);
        return toResponse(portfolio);
    }

    @Transactional(readOnly = true)
    public List<PortfolioResponse> getPortfoliosByClientId(Long clientId) {
        getClient(clientId);
        return portfolioRepository.findByClientClientId(clientId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PortfolioResponse createPortfolio(PortfolioRequest request) {
        ClientPortfolio portfolio = new ClientPortfolio();
        applyRequest(portfolio, request);
        ClientPortfolio saved = portfolioRepository.save(portfolio);
        return toResponse(saved);
    }

    @Transactional
    public PortfolioResponse updatePortfolio(Long id, PortfolioRequest request) {
        ClientPortfolio portfolio = getPortfolioEntity(id);
        applyRequest(portfolio, request);
        ClientPortfolio saved = portfolioRepository.save(portfolio);
        return toResponse(saved);
    }

    @Transactional
    public void deletePortfolio(Long id) {
        ClientPortfolio portfolio = getPortfolioEntity(id);
        portfolioRepository.delete(portfolio);
    }

    private ClientPortfolio getPortfolioEntity(Long id) {
        return portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id " + id));
    }

    private Client getClient(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id " + clientId));
    }

    private Stock getStock(Long stockId) {
        return stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id " + stockId));
    }

    private void applyRequest(ClientPortfolio portfolio, PortfolioRequest request) {
        portfolio.setClient(getClient(request.clientId()));
        portfolio.setStock(getStock(request.stockId()));
        portfolio.setSharesOwned(request.sharesOwned());
        portfolio.setPurchasePrice(request.purchasePrice());
        portfolio.setPurchaseDate(request.purchaseDate());
    }

    private PortfolioResponse toResponse(ClientPortfolio portfolio) {
        return new PortfolioResponse(
                portfolio.getPortfolioId(),
                portfolio.getClient().getClientId(),
                portfolio.getStock().getStockId(),
                portfolio.getSharesOwned(),
                portfolio.getPurchasePrice(),
                portfolio.getPurchaseDate()
        );
    }
}
