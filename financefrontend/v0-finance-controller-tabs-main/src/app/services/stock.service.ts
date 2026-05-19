import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface Stock {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private readonly apiUrl = 'http://54.211.223.150:8080/api/stocks';

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching stocks:', error);
        return of([]);
      })
    );
  }

  getStockById(id: number): Observable<Stock | null> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching stock:', error);
        return of(null);
      })
    );
  }
}
