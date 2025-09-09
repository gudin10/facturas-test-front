import { Observable } from 'rxjs';
import { Cliente, FacturaResumen } from 'src/app/core/models/factura.model';
import { Producto } from 'src/app/core/models/factura.model';
import { CrearFacturaDto } from 'src/app/core/models/factura.model';

export abstract class FacturaGateway {
  abstract getClientes(): Observable<Cliente[]>;
  abstract getProductos(): Observable<Producto[]>;
  abstract validarNumeroFactura(numero: number): Observable<{ existe: boolean }>;
  abstract crearFactura(dto: CrearFacturaDto): Observable<any>;
  abstract buscarFacturas(numeroFactura?: number, idCliente?: number): Observable<FacturaResumen[]>;
}
