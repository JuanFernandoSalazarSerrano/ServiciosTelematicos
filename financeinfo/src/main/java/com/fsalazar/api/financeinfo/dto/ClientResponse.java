package com.fsalazar.api.financeinfo.dto;

import java.time.LocalDateTime;

public record ClientResponse(
        Long clientId,
        String firstName,
        String lastName,
        String email,
        String phone,
        String city,
        LocalDateTime createdAt
) {
}
