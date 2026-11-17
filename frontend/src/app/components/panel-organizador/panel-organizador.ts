import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Resumen } from '../../services/resumen.service';

@Component({
  selector: 'app-panel-organizador',
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-organizador.html',
  styleUrl: './panel-organizador.css'
})
export class PanelOrganizador implements OnInit {
  private readonly resumenService = inject(Resumen);
  private readonly route = inject(ActivatedRoute);

  readonly cargando = signal(true);
  readonly datosPanel = signal<any>(null);

  invitadosFiltrados: any[] = [];
  textoFiltro: string = '';
  filtroEstadoActual: string = 'todos';
  seccionActual: string = 'modificar';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventoId = params.get('id');
      if (eventoId) {
        this.cargarDatos(eventoId);
      } else {
        this.cargando.set(false);
        console.error('No se encontró el ID del evento en la ruta.');
      }
    });
  }

  cargarDatos(eventoId: string) {
    this.cargando.set(true);

    this.resumenService.getConfirmaciones(eventoId).subscribe({
      next: (respuesta) => {
        this.datosPanel.set(respuesta);
        this.invitadosFiltrados = respuesta.invitados || [];
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el panel:', err);
        this.cargando.set(false);
      }
    });
  }

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
  }

  filtrarPorEstado(estado: string) {
    this.filtroEstadoActual = estado;
    const invitados = this.datosPanel()?.invitados || [];

    if (estado === 'todos') {
      this.invitadosFiltrados = invitados;
    } else {
      this.invitadosFiltrados = invitados.filter((inv: any) => 
        inv.estado.toLowerCase() === estado.toLowerCase()
      );
    }
  }

  filtrarInvitados() {
    const busqueda = this.textoFiltro.toLowerCase();
    const invitados = this.datosPanel()?.invitados || [];
    
    this.invitadosFiltrados = invitados.filter((inv: any) =>
      inv.nombre.toLowerCase().includes(busqueda)
    );
  }
}