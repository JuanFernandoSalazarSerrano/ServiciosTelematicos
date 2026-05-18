package com.fsalazar.api.financeinfo.controller;

import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health-text")
public class HealthController {

    private final Environment environment;

    public HealthController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getHealth() {
        String port = environment.getProperty("local.server.port");
        if (port == null || port.isBlank()) {
            port = environment.getProperty("server.port", "ERROR GETTING PORT");
        }
        return ResponseEntity.ok(Map.of("message", "health good - port: " + port));
    }
}
