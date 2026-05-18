import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  status: string;
  balance: number;
  createdAt: string;
}

interface ClientApi {
  clientId?: number;
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  accountType?: string;
  status?: string;
  balance?: number | string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<ClientApi[]>(this.apiUrl).pipe(
      map((clients) => clients.map((client) => this.toClient(client))),
      catchError((error) => {
        console.error('Error fetching clients:', error);
        return of([]);
      })
    );
  }

  getClientById(id: number): Observable<Client | null> {
    return this.http.get<ClientApi>(`${this.apiUrl}/${id}`).pipe(
      map((client) => this.toClient(client)),
      catchError((error) => {
        console.error('Error fetching client:', error);
        return of(null);
      })
    );
  }

  private toClient(client: ClientApi): Client {
    const resolvedId = this.toNumber(client.clientId ?? client.id);
    const name =
      client.name ||
      [client.firstName, client.lastName].filter(Boolean).join(' ') ||
      `Client #${resolvedId}`;

    return {
      id: resolvedId,
      name,
      email: client.email || '-',
      phone: client.phone || '-',
      accountType: client.accountType || 'Standard',
      status: client.status || 'Active',
      balance: this.toNumber(client.balance),
      createdAt: client.createdAt || '',
    };
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }
}
