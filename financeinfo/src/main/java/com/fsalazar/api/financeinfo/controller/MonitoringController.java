package com.fsalazar.api.financeinfo.controller;

import com.fsalazar.api.financeinfo.monitoring.RequestMetrics;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;
import java.net.InetAddress;
import java.time.Instant;

@RestController
@RequestMapping("/api")
public class MonitoringController {

    private final Environment environment;
    private final RequestMetrics requestMetrics;

    public MonitoringController(Environment environment, RequestMetrics requestMetrics) {
        this.environment = environment;
        this.requestMetrics = requestMetrics;
    }

    @GetMapping("/health")
    public ResponseEntity<MonitoringResponse> health() {
        return ResponseEntity.ok(buildSnapshot());
    }

    @GetMapping("/metrics")
    public ResponseEntity<MonitoringResponse> metrics() {
        return ResponseEntity.ok(buildSnapshot());
    }

    @GetMapping("/system")
    public ResponseEntity<MonitoringResponse> system() {
        return ResponseEntity.ok(buildSnapshot());
    }

    @GetMapping("/stats")
    public ResponseEntity<MonitoringResponse> stats() {
        return ResponseEntity.ok(buildSnapshot());
    }

    private MonitoringResponse buildSnapshot() {
        RuntimeMXBean runtimeMxBean = ManagementFactory.getRuntimeMXBean();
        ThreadMXBean threadMxBean = ManagementFactory.getThreadMXBean();
        Runtime runtime = Runtime.getRuntime();

        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;

        return new MonitoringResponse(
                "health good",
                "UP",
                Instant.now(),
                runtimeMxBean.getUptime(),
                resolvePort(),
                requestMetrics.getTotalRequests(),
                requestMetrics.getTotalRequests(),
                requestMetrics.getActiveRequests(),
                new MemoryUsage(usedMemory, freeMemory, totalMemory, runtime.maxMemory()),
                buildCpuUsage(),
                threadMxBean.getThreadCount(),
                resolveHostname()
        );
    }

    private CpuUsage buildCpuUsage() {
        com.sun.management.OperatingSystemMXBean osBean =
                ManagementFactory.getPlatformMXBean(com.sun.management.OperatingSystemMXBean.class);
        if (osBean == null) {
            return new CpuUsage(null, null, null);
        }
        Double processCpu = toPercent(osBean.getProcessCpuLoad());
        Double systemCpu = toPercent(osBean.getSystemCpuLoad());
        Double loadAverage = osBean.getSystemLoadAverage();
        if (loadAverage != null && loadAverage < 0) {
            loadAverage = null;
        }
        return new CpuUsage(processCpu, systemCpu, loadAverage);
    }

    private Double toPercent(double value) {
        if (value < 0) {
            return null;
        }
        return Math.round(value * 1000.0) / 10.0;
    }

    private String resolvePort() {
        String port = environment.getProperty("local.server.port");
        if (port == null || port.isBlank()) {
            port = environment.getProperty("server.port", "8080");
        }
        return port;
    }

    private String resolveHostname() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (Exception ex) {
            return "unknown";
        }
    }

    public record MonitoringResponse(
            String message,
            String backendStatus,
            Instant timestamp,
            long uptimeMs,
            String port,
            long requestCounter,
            long totalRequestsServed,
            long activeConnectionsEstimate,
            MemoryUsage memory,
            CpuUsage cpu,
            int threadCount,
            String hostname
    ) {
    }

    public record MemoryUsage(
            long usedBytes,
            long freeBytes,
            long totalBytes,
            long maxBytes
    ) {
    }

    public record CpuUsage(
            Double processCpuLoadPercent,
            Double systemCpuLoadPercent,
            Double systemLoadAverage
    ) {
    }
}
