import { Routes } from '@angular/router';
import { StocksComponent } from './components/stocks/stocks.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientPortfolioComponent } from './components/client-portfolio/client-portfolio.component';
import { PortfoliosComponent } from './components/portfolios/portfolios.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { HealthComponent } from './components/health/health.component';
import { FailuresComponent } from './components/failures/failures.component';

export const routes: Routes = [
  { path: '', redirectTo: '/stocks', pathMatch: 'full' },
  { path: 'stocks', component: StocksComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/:clientId/portfolio', component: ClientPortfolioComponent },
  { path: 'portfolios', component: PortfoliosComponent },
  { path: 'monitoring', component: MonitoringComponent },
  { path: 'health', component: HealthComponent },
  { path: 'failures', component: FailuresComponent },
];
