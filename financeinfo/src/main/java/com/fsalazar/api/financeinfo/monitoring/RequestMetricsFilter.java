package com.fsalazar.api.financeinfo.monitoring;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestMetricsFilter extends OncePerRequestFilter {

    private final RequestMetrics requestMetrics;

    public RequestMetricsFilter(RequestMetrics requestMetrics) {
        this.requestMetrics = requestMetrics;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        requestMetrics.onRequestStart();
        try {
            filterChain.doFilter(request, response);
        } finally {
            requestMetrics.onRequestFinish();
        }
    }
}
