package com.fsalazar.api.financeinfo.controller;

import com.fsalazar.api.financeinfo.dto.FailureRequest;
import com.fsalazar.api.financeinfo.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/failures")
public class FailureController {

    @GetMapping("/bad-request")
    public ResponseEntity<Void> badRequest(@RequestParam(defaultValue = "Bad request for testing") String message) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    @GetMapping("/not-found")
    public ResponseEntity<Void> notFound(@RequestParam(defaultValue = "Resource not found for testing") String message) {
        throw new ResourceNotFoundException(message);
    }

    @GetMapping("/server-error")
    public ResponseEntity<Void> serverError(@RequestParam(defaultValue = "Server error for testing") String message) {
        throw new RuntimeException(message);
    }

    @GetMapping("/unavailable")
    public ResponseEntity<Void> unavailable(@RequestParam(defaultValue = "Service unavailable for testing") String message) {
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, message);
    }

    @GetMapping("/timeout")
    public ResponseEntity<String> timeout(@RequestParam(defaultValue = "5") long seconds) throws InterruptedException {
        if (seconds < 1 || seconds > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "seconds must be between 1 and 30");
        }
        Thread.sleep(seconds * 1000L);
        return ResponseEntity.ok("Recovered after " + seconds + "s");
    }

    @PostMapping("/validation")
    public ResponseEntity<Void> validation(@Valid @RequestBody FailureRequest request) {
        return ResponseEntity.ok().build();
    }
}
