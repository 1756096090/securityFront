import { Routes } from '@angular/router';
import { EnterDomainComponent } from './enter-domain/enter-domain.component';
import { AssetsScanComponent } from './assets-scan/assets-scan.component';

export const routes: Routes = [
  { path: '', component: EnterDomainComponent },
  { path: 'assets-scan/:domain', component: AssetsScanComponent }  // Ruta con parámetro
];
