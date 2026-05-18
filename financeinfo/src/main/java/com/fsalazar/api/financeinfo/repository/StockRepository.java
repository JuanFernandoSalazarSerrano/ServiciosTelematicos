package com.fsalazar.api.financeinfo.repository;

import com.fsalazar.api.financeinfo.domain.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findBySymbolIgnoreCase(String symbol);
}
