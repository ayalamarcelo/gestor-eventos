import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resumen } from '../../servicios/resumen';

@Component({
  selector: 'app-panel-organizador',
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-organizador.html',
  styleUrl: './panel-organizador.css'
})
export class PanelOrganizador implements OnInit {
  private readonly resumenService = inject(Resumen);

  datosPanel: any = null;
  invitadosFiltrados: any[] = [];
  textoFiltro: string = '';
  filtroEstadoActual: string = 'todos';
  cargando: boolean = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = false;
    this.resumenService.getResumenPanel().subscribe({
      next: (respuesta) => {
        this.datosPanel = respuesta;
        this.invitadosFiltrados = respuesta.invitados || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el panel:', err);
        this.cargando = false;
      }
    });
  }

  filtrarPorEstado(estado: string) {
    this.filtroEstadoActual = estado;
    if (estado === 'todos') {
      this.invitadosFiltrados = this.datosPanel.invitados;
    } else {
      this.invitadosFiltrados = this.datosPanel.invitados.filter((inv: any) => 
        inv.estado.toLowerCase() === estado.toLowerCase()
      );
    }
  }

  filtrarInvitados() {
    const busqueda = this.textoFiltro.toLowerCase();
    this.invitadosFiltrados = this.datosPanel.invitados.filter((inv: any) =>
      inv.nombre.toLowerCase().includes(busqueda)
    );
  }
}