package com.fsalazar.api.financeinfo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record StockResponse(
        Long stockId,
        String symbol,
        String companyName,
        BigDecimal currentPrice,
        String sector,
        LocalDateTime createdAt
) {
}
