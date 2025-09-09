
export interface Cliente {
  id: number;
  razonSocial: string;
}

export interface Producto {
  id: number;
  nombreProducto: string;
  precioUnitario: number;
  imagenProducto?: string;
}

export interface FacturaDetalle {
  idProducto: number;
  cantidadDeProducto: number;
  precioUnitarioProducto: number;
  subtotalProducto: number;
  notas?: string;
}

export interface CrearFacturaDto {
  id: number;
  fechaEmisionFactura: string;
  idCliente: number;
  numeroFactura: number;
  detalles: FacturaDetalle[];
  subTotalFacturas: number;
  totalImpuestos: number;
  totalFactura: number;
}

export interface FacturaResumen {
  id: number;
  numeroFactura: number;
  fechaEmisionFactura: string;
  totalFactura: number;
}
