package com.fsalazar.api.financeinfo.monitoring;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class RequestMetrics {

    private final AtomicLong totalRequests = new AtomicLong();
    private final AtomicLong activeRequests = new AtomicLong();

    public void onRequestStart() {
        totalRequests.incrementAndGet();
        activeRequests.incrementAndGet();
    }

    public void onRequestFinish() {
        activeRequests.updateAndGet(value -> value > 0 ? value - 1 : 0);
    }

    public long getTotalRequests() {
        return totalRequests.get();
    }

    public long getActiveRequests() {
        return activeRequests.get();
    }
}
