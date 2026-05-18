package com.fsalazar.api.financeinfo.repository;

import com.fsalazar.api.financeinfo.domain.ClientPortfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientPortfolioRepository extends JpaRepository<ClientPortfolio, Long> {
    List<ClientPortfolio> findByClientClientId(Long clientId);
}
