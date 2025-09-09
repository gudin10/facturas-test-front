import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { Cliente } from 'src/app/core/models/factura.model';
import { Producto } from 'src/app/core/models/factura.model';
import { FacturaUseCase } from 'src/app/domain/usecases/factura.usecase';
import { CrearFacturaDto } from 'src/app/core/models/factura.model';

@Component({
  selector: 'app-crear-factura',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.css']
})
export class CrearFacturaComponent implements OnInit {
  facturaForm: FormGroup;
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  subtotal = 0;
  impuestos = 0;
  total = 0;

  displayedColumns = ['producto', 'precio', 'cantidad', 'imagen', 'total'];

  constructor(
    private fb: FormBuilder,
    private useCase: FacturaUseCase,
    private snack: MatSnackBar
  ) {
    this.facturaForm = this.fb.group({
      idCliente: [null, Validators.required],
      numeroFactura: [null, Validators.required],
      fechaEmisionFactura: [new Date().toISOString()],
      detalles: this.fb.array([])
    });
  }

  ngOnInit() {
    this.useCase.getClientes().subscribe(c => this.clientes = c);
    this.useCase.getProductos().subscribe(p => this.productos = p);
    this.addDetalle();
  }

  get detalles() {
    return this.facturaForm.get('detalles') as FormArray;
  }

  addDetalle() {
    this.detalles.push(this.fb.group({
      idProducto: [null, Validators.required],
      precioUnitarioProducto: [0],
      cantidadDeProducto: [1],
      subtotalProducto: [0],
      imagen: ['']
    }));
  }

  resetForm() {
    this.facturaForm.reset({
      fechaEmisionFactura: new Date().toISOString(),
      idCliente: null,
      numeroFactura: null,
      detalles: []
    });
    this.detalles.clear();
    this.addDetalle();
    this.recalcularTotales();
  }

  onSelectProducto(index: number) {
    const g = this.detalles.at(index);
    const prod = this.productos.find(p => p.id === g.value.idProducto);
    if (!prod) return;
    g.patchValue({
      precioUnitarioProducto: prod.precioUnitario,
      imagen: prod.imagenProducto || ''
    });
    this.recalcularLinea(index);
  }

  recalcularLinea(index: number) {
    const g = this.detalles.at(index);
    const cantidad = Number(g.value.cantidadDeProducto) || 0;
    const precio = Number(g.value.precioUnitarioProducto) || 0;
    const subtotal = cantidad * precio;
    g.patchValue({ subtotalProducto: subtotal }, { emitEvent: false });
    this.recalcularTotales();
  }

  recalcularTotales() {
    this.subtotal = this.detalles.controls.reduce((s, c) => s + (c.value.subtotalProducto || 0), 0);
    this.impuestos = +(this.subtotal * 0.19).toFixed(2);
    this.total = this.subtotal + this.impuestos;
  }

  guardar() {
    const dto: CrearFacturaDto = {
      ...this.facturaForm.value,
      id: 0,
      detalles: this.facturaForm.value.detalles,
      subTotalFacturas: this.subtotal,
      totalImpuestos: this.impuestos,
      totalFactura: this.total
    };

    this.useCase.validarNumeroFactura(dto.numeroFactura).subscribe({
      next: (res:any) => {
        if (res.existe) {
          this.snack.open('El número de factura ya existe', 'Cerrar', { duration: 3000 });
        } else {
          this.useCase.crearFactura(dto).subscribe({
            next: () => this.snack.open('Se registró la factura con éxito', 'Cerrar', { duration: 3000 }),
            error: () => this.snack.open('Error al registrar la factura', 'Cerrar', { duration: 3000 })
          });
        }
      },
      error: () => this.snack.open('Error al validar número de factura', 'Cerrar', { duration: 3000 })
    });
  }
}
