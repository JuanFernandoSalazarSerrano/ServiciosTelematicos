package com.fsalazar.api.financeinfo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record StockRequest(
        @NotBlank String symbol,
        @NotBlank String companyName,
        @NotNull @Positive BigDecimal currentPrice,
        @NotBlank String sector
) {
}
