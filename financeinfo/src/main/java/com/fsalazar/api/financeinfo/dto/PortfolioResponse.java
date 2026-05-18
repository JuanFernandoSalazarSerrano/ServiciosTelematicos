package com.fsalazar.api.financeinfo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PortfolioResponse(
        Long portfolioId,
        Long clientId,
        Long stockId,
        Integer sharesOwned,
        BigDecimal purchasePrice,
        LocalDate purchaseDate
) {
}
