import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface MemoryUsage {
  usedBytes: number;
  freeBytes: number;
  totalBytes: number;
  maxBytes: number;
}

export interface CpuUsage {
  processCpuLoadPercent: number | null;
  systemCpuLoadPercent: number | null;
  systemLoadAverage: number | null;
}

export interface MonitoringResponse {
  message: string;
  backendStatus: string;
  timestamp: string;
  uptimeMs: number;
  port: string;
  requestCounter: number;
  totalRequestsServed: number;
  activeConnectionsEstimate: number;
  memory: MemoryUsage;
  cpu: CpuUsage;
  threadCount: number;
  hostname: string;
}

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<MonitoringResponse | null> {
    return this.http.get<MonitoringResponse>(`${this.baseUrl}/health`).pipe(
      catchError((error) => {
        console.error('Error fetching health:', error);
        return of(null);
      })
    );
  }

  getMetrics(): Observable<MonitoringResponse | null> {
    return this.http.get<MonitoringResponse>(`${this.baseUrl}/metrics`).pipe(
      catchError((error) => {
        console.error('Error fetching metrics:', error);
        return of(null);
      })
    );
  }

  getSystem(): Observable<MonitoringResponse | null> {
    return this.http.get<MonitoringResponse>(`${this.baseUrl}/system`).pipe(
      catchError((error) => {
        console.error('Error fetching system info:', error);
        return of(null);
      })
    );
  }

  getStats(): Observable<MonitoringResponse | null> {
    return this.http.get<MonitoringResponse>(`${this.baseUrl}/stats`).pipe(
      catchError((error) => {
        console.error('Error fetching stats:', error);
        return of(null);
      })
    );
  }
}
