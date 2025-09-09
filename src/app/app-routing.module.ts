import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearFacturaComponent } from './ui/crear-factura/crear-factura.component';
import { BuscarFacturaComponent } from './ui/buscar-factura/buscar-factura.component';

const routes: Routes = [
  { path: '', redirectTo: 'facturas/crear', pathMatch: 'full' },
  { path: 'facturas/crear', component: CrearFacturaComponent },
  { path: 'facturas/buscar', component: BuscarFacturaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
