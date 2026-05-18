import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface Portfolio {
  id: number;
  name: string;
  clientId: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: number;
  riskLevel: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly apiUrl = 'http://localhost:8080/api/portfolios';

  constructor(private http: HttpClient) {}

  getAllPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching portfolios:', error);
        return of([]);
      })
    );
  }

  getPortfolioById(id: number): Observable<Portfolio | null> {
    return this.http.get<Portfolio>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching portfolio:', error);
        return of(null);
      })
    );
  }

  getPortfoliosByClientId(clientId: number): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/client/${clientId}`).pipe(
      catchError((error) => {
        console.error('Error fetching portfolios for client:', error);
        return of([]);
      })
    );
  }
}
