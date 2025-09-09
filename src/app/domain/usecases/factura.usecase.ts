import { Injectable } from '@angular/core';
import { FacturaGateway } from '../gateways/factura.gateway';
import { CrearFacturaDto } from 'src/app/core/models/factura.model';

@Injectable({ providedIn: 'root' })
export class FacturaUseCase {
  constructor(private gateway: FacturaGateway) {}

  getClientes() {
    return this.gateway.getClientes();
  }

  getProductos() {
    return this.gateway.getProductos();
  }

  validarNumeroFactura(numero: number) {
    return this.gateway.validarNumeroFactura(numero);
  }

  crearFactura(dto: CrearFacturaDto) {
    return this.gateway.crearFactura(dto);
  }

  buscarFacturas(numeroFactura?: number, idCliente?: number) {
    return this.gateway.buscarFacturas(numeroFactura, idCliente);
  }
}
