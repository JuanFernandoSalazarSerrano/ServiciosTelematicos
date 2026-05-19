import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';

export interface FailureResult {
  endpoint: string;
  status: string;
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FailureService {
  private readonly apiUrl = 'http://54.211.223.150:8080/api/failures';

  constructor(private http: HttpClient) {}

  triggerBadRequest(message?: string): Observable<FailureResult> {
    let params = new HttpParams();
    if (message) {
      params = params.set('message', message);
    }
    return this.http.get<FailureResult>(`${this.apiUrl}/bad-request`, { params }).pipe(
      map(() => ({
        endpoint: '/bad-request',
        status: 'Success',
        message: 'Bad Request completed',
        timestamp: new Date(),
      })),
      catchError((error) => {
        return of({
          endpoint: '/bad-request',
          status: 'Error',
          message: error.error?.message || error.message || 'Bad Request triggered',
          timestamp: new Date(),
        });
      })
    );
  }

  triggerNotFound(message?: string): Observable<FailureResult> {
    let params = new HttpParams();
    if (message) {
      params = params.set('message', message);
    }
    return this.http.get<FailureResult>(`${this.apiUrl}/not-found`, { params }).pipe(
      map(() => ({
        endpoint: '/not-found',
        status: 'Success',
        message: 'Not Found completed',
        timestamp: new Date(),
      })),
      catchError((error) => {
        return of({
          endpoint: '/not-found',
          status: 'Error',
          message: error.error?.message || error.message || 'Not Found triggered',
          timestamp: new Date(),
        });
      })
    );
  }

  triggerServerError(message?: string): Observable<FailureResult> {
    let params = new HttpParams();
    if (message) {
      params = params.set('message', message);
    }
    return this.http.get<FailureResult>(`${this.apiUrl}/server-error`, { params }).pipe(
      map(() => ({
        endpoint: '/server-error',
        status: 'Success',
        message: 'Server Error completed',
        timestamp: new Date(),
      })),
      catchError((error) => {
        return of({
          endpoint: '/server-error',
          status: 'Error',
          message: error.error?.message || error.message || 'Server Error triggered',
          timestamp: new Date(),
        });
      })
    );
  }

  triggerUnavailable(message?: string): Observable<FailureResult> {
    let params = new HttpParams();
    if (message) {
      params = params.set('message', message);
    }
    return this.http.get<FailureResult>(`${this.apiUrl}/unavailable`, { params }).pipe(
      map(() => ({
        endpoint: '/unavailable',
        status: 'Success',
        message: 'Service Unavailable completed',
        timestamp: new Date(),
      })),
      catchError((error) => {
        return of({
          endpoint: '/unavailable',
          status: 'Error',
          message: error.error?.message || error.message || 'Service Unavailable triggered',
          timestamp: new Date(),
        });
      })
    );
  }

  triggerTimeout(seconds: number = 5): Observable<FailureResult> {
    const params = new HttpParams().set('seconds', seconds.toString());
    return this.http.get(`${this.apiUrl}/timeout`, { params, responseType: 'text' }).pipe(
      map((response) => ({
        endpoint: '/timeout',
        status: 'Success',
        message: response || `Recovered after ${seconds}s`,
        timestamp: new Date(),
      })),
      catchError((error) => {
        return of({
          endpoint: '/timeout',
          status: 'Error',
          message: error.error?.message || error.message || 'Timeout triggered',
          timestamp: new Date(),
        });
      })
    );
  }
}
