import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, FacturaResumen } from '../core/models/factura.model';
import { Producto } from '../core/models/factura.model';
import { CrearFacturaDto } from '../core/models/factura.model';
import { FacturaGateway } from '../domain/gateways/factura.gateway';

@Injectable({ providedIn: 'root' })
export class FacturaHttpService extends FacturaGateway {
  private baseUrl = 'https://localhost:7246/api/Facturas';

  constructor(private http: HttpClient) { super(); }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('https://localhost:7246/api/Clientes');
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }

  validarNumeroFactura(numero: number): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.baseUrl}/validar-numero-factura/${numero}`);
  }

  crearFactura(dto: CrearFacturaDto): Observable<any> {
    return this.http.post<any>(this.baseUrl, dto);
  }

  buscarFacturas(numeroFactura?: number, idCliente?: number): Observable<FacturaResumen[]> {
    const params: string[] = [];
      if (numeroFactura) params.push(`numeroFactura=${numeroFactura}`);
      if (idCliente) params.push(`idCliente=${idCliente}`);
      const query = params.length ? '?' + params.join('&') : '';
    return this.http.get<FacturaResumen[]>(`${this.baseUrl}/buscar${query}`);
  }

}
