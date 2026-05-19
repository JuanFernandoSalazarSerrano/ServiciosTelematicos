import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

export interface ClientSummary {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  createdAt?: string;
  accountType?: string;
  status?: string;
  balance?: number;
}

export interface ClientHolding {
  portfolioId: number;
  clientId: number;
  stockId: number;
  symbol: string;
  companyName: string;
  sector?: string;
  sharesOwned: number;
  purchasePrice: number;
  purchaseDate?: string;
  currentPrice?: number;
  positionValue: number;
  gainLoss: number;
  gainLossPercent: number | null;
}

export interface ClientPortfolioView {
  client: ClientSummary | null;
  holdings: ClientHolding[];
}

interface ClientApi {
  clientId?: number;
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  createdAt?: string;
  accountType?: string;
  status?: string;
  balance?: number | string;
}

interface PortfolioApi {
  portfolioId?: number;
  clientId?: number;
  stockId?: number;
  sharesOwned?: number;
  purchasePrice?: number | string;
  purchaseDate?: string;
  createdAt?: string;
  id?: number;
  holdings?: number;
}

interface StockApi {
  stockId?: number;
  id?: number;
  symbol?: string;
  companyName?: string;
  name?: string;
  currentPrice?: number | string;
  price?: number | string;
  sector?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientPortfolioService {
  private readonly clientsUrl = 'http://54.211.223.150:8080/api/clients';
  private readonly portfoliosUrl = 'http://54.211.223.150:8080/api/portfolios';
  private readonly stocksUrl = 'http://54.211.223.150:8080/api/stocks';

  constructor(private http: HttpClient) {}

  getClientPortfolio(clientId: number): Observable<ClientPortfolioView> {
    const client$ = this.http.get<ClientApi>(`${this.clientsUrl}/${clientId}`).pipe(
      catchError((error) => {
        console.error('Error fetching client profile:', error);
        return of(null);
      })
    );

    const portfolios$ = this.http
      .get<PortfolioApi[]>(`${this.portfoliosUrl}/client/${clientId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching client portfolios:', error);
          return of([]);
        })
      );

    const stocks$ = this.http.get<StockApi[]>(this.stocksUrl).pipe(
      catchError((error) => {
        console.error('Error fetching stocks:', error);
        return of([]);
      })
    );

    return forkJoin({ client: client$, portfolios: portfolios$, stocks: stocks$ }).pipe(
      map(({ client, portfolios, stocks }) => {
        const stockById = new Map<number, StockApi>();
        for (const stock of stocks) {
          const stockId = this.toNumber(stock.stockId ?? stock.id);
          if (stockId > 0) {
            stockById.set(stockId, stock);
          }
        }

        const holdings = portfolios.map((portfolio) =>
          this.toHolding(portfolio, stockById.get(this.toNumber(portfolio.stockId)))
        );

        return {
          client: this.toClientSummary(client),
          holdings,
        };
      })
    );
  }

  private toClientSummary(client: ClientApi | null): ClientSummary | null {
    if (!client) return null;

    const id = this.toNumber(client.clientId ?? client.id);
    const name =
      client.name ||
      [client.firstName, client.lastName].filter(Boolean).join(' ') ||
      `Client #${id}`;

    return {
      id,
      name,
      email: client.email || undefined,
      phone: client.phone || undefined,
      city: client.city || undefined,
      createdAt: client.createdAt,
      accountType: client.accountType,
      status: client.status,
      balance: this.toNumber(client.balance),
    };
  }

  private toHolding(portfolio: PortfolioApi, stock: StockApi | undefined): ClientHolding {
    const portfolioId = this.toNumber(portfolio.portfolioId ?? portfolio.id);
    const clientId = this.toNumber(portfolio.clientId);
    const stockId = this.toNumber(portfolio.stockId ?? stock?.stockId ?? stock?.id);
    const sharesOwned = this.toNumber(portfolio.sharesOwned ?? portfolio.holdings);
    const purchasePrice = this.toNumber(portfolio.purchasePrice);
    const currentPrice = this.toNumber(stock?.currentPrice ?? stock?.price);
    const effectivePrice = currentPrice || purchasePrice;
    const positionValue = sharesOwned * (effectivePrice || 0);
    const costBasis = sharesOwned * purchasePrice;
    const gainLoss = positionValue - costBasis;
    const gainLossPercent = costBasis ? (gainLoss / costBasis) * 100 : null;

    return {
      portfolioId,
      clientId,
      stockId,
      symbol: stock?.symbol || 'N/A',
      companyName: stock?.companyName || stock?.name || 'Unknown Company',
      sector: stock?.sector,
      sharesOwned,
      purchasePrice,
      purchaseDate: portfolio.purchaseDate || portfolio.createdAt,
      currentPrice: currentPrice || undefined,
      positionValue,
      gainLoss,
      gainLossPercent,
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
