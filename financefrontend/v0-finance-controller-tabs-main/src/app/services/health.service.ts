import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface HealthResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private readonly apiUrl = 'http://localhost:8080/api/health-text';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<HealthResponse | null> {
    return this.http.get<HealthResponse>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching health:', error);
        return of(null);
      })
    );
  }
}
