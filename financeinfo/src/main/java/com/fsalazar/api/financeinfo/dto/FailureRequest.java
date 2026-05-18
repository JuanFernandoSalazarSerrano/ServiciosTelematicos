package com.fsalazar.api.financeinfo.dto;

import jakarta.validation.constraints.NotBlank;

public record FailureRequest(
        @NotBlank String message
) {
}
