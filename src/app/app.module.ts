import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacturaGateway } from './domain/gateways/factura.gateway';
import { FacturaHttpService } from './infrastructure/facturas.service.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: FacturaGateway, useClass: FacturaHttpService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
