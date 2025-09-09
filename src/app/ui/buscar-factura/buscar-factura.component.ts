import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FacturaUseCase } from 'src/app/domain/usecases/factura.usecase';
import { Cliente } from 'src/app/core/models/factura.model';
import { FacturaResumen } from 'src/app/core/models/factura.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-buscar-factura',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatTableModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './buscar-factura.component.html',
  styleUrls: ['./buscar-factura.component.css']
})
export class BuscarFacturaComponent implements OnInit {
  form: FormGroup;
  clientes: Cliente[] = [];
  facturas: FacturaResumen[] = [];
  displayedColumns = ['numeroFactura', 'fechaEmisionFactura', 'totalFactura'];

  constructor(
    private fb: FormBuilder,
    private useCase: FacturaUseCase,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      tipoBusqueda: ['cliente', Validators.required],
      idCliente: [null],
      numeroFactura: [null]
    });
  }

  ngOnInit() {
    this.useCase.getClientes().subscribe(c => this.clientes = c);

    // deshabilitar campos según tipo de búsqueda
    this.form.get('tipoBusqueda')?.valueChanges.subscribe(tipo => {
      if (tipo === 'cliente') {
        this.form.get('idCliente')?.enable();
        this.form.get('numeroFactura')?.disable();
      } else {
        this.form.get('numeroFactura')?.enable();
        this.form.get('idCliente')?.disable();
      }
    });
    this.form.get('numeroFactura')?.disable();
  }

  buscar() {
    const tipo = this.form.value.tipoBusqueda;
    const idCliente = tipo === 'cliente' ? this.form.value.idCliente : undefined;
    const numeroFactura = tipo === 'numero' ? this.form.value.numeroFactura : undefined;

    if (!idCliente && !numeroFactura) {
      this.snack.open('Debe seleccionar un criterio de búsqueda', 'Cerrar', { duration: 3000 });
      return;
    }

    this.useCase.buscarFacturas(numeroFactura, idCliente).subscribe({
      next: res => this.facturas = res,
      error: () => this.snack.open('Error al buscar facturas', 'Cerrar', { duration: 3000 })
    });
  }
}
