package com.fsalazar.api.financeinfo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PortfolioRequest(
        @NotNull @Positive Long clientId,
        @NotNull @Positive Long stockId,
        @NotNull @Positive Integer sharesOwned,
        @NotNull @Positive BigDecimal purchasePrice,
        @NotNull LocalDate purchaseDate
) {
}
