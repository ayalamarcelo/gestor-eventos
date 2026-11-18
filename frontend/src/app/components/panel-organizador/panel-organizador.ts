import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { eventService } from '../../services/event.service';
import { InvitadoService } from '../../services/guests.service';
import { event } from '../../models/event.model';

interface FilaInvitado {
  id: number;
  nombre: string;
  iniciales: string;
  acompanantes: number;
  restriccion: string | null;
  estado: string;
}

@Component({
  selector: 'app-panel-organizador',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './panel-organizador.html',
  styleUrl: './panel-organizador.css'
})
export class PanelOrganizador implements OnInit {
  private readonly _eventService = inject(eventService);
  private readonly _invitadoService = inject(InvitadoService);
  private readonly _route = inject(ActivatedRoute);

  readonly eventoId = signal(0);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly evento = signal<event | null>(null);
  readonly invitados = signal<FilaInvitado[]>([]);
  readonly filtroEstado = signal('todos');

  readonly nuevoNombre = signal('');
  readonly agregando = signal(false);
  readonly errorAgregar = signal<string | null>(null);

  readonly invitadosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    return this.invitados().filter(i => estado === 'todos' || i.estado.toLowerCase() === estado);
  });

  // Números de las tarjetas
  readonly asisten = computed(() => this.invitados().filter(i => i.estado === 'Asiste'));
  readonly totalPersonas = computed(() => this.asisten().reduce((suma, i) => suma + 1 + i.acompanantes, 0));
  readonly noAsisten = computed(() => this.invitados().filter(i => i.estado === 'No asiste').length);
  readonly pendientes = computed(() => this.invitados().filter(i => i.estado === 'Pendiente').length);
  readonly conRestriccion = computed(() =>
    this.asisten().filter(i => i.restriccion && i.restriccion !== 'ninguna').length
  );
  readonly porcentajeRespuesta = computed(() => {
    const total = this.invitados().length;
    return total ? Math.round((total - this.pendientes()) / total * 100) : 0;
  });

  readonly restricciones = computed(() => {
    const asisten = this.asisten();
    const tipos = [
      { clave: 'vegetariano', nombre: 'Vegetariano' },
      { clave: 'celiaco', nombre: 'Celíaco' },
      { clave: 'alergia', nombre: 'Alergias' },
      { clave: 'otra', nombre: 'Otra' }
    ];
    return tipos.map(t => {
      const cantidad = asisten.filter(i => i.restriccion === t.clave).length;
      return { ...t, cantidad, porcentaje: asisten.length ? cantidad / asisten.length * 100 : 0 };
    });
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El id del evento no es válido');
      this.cargando.set(false);
      return;
    }
    this.eventoId.set(id);

    this._eventService.getById(id).subscribe({
      next: (data) => this.evento.set(data),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar el evento')
    });

    this.cargarInvitados();
  }

  cargarInvitados() {
    this._invitadoService.obtenerInvitados(this.eventoId()).subscribe({
      next: (invitados) => {
        this.invitados.set(invitados.map((i: any) => ({
          id: i.id,
          nombre: i.nombre,
          iniciales: i.nombre.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase(),
          acompanantes: i.cantidad_acompanantes ?? 0,
          restriccion: i.restriccion,
          estado: !i.ya_confirmo ? 'Pendiente' : i.asiste ? 'Asiste' : 'No asiste'
        })));
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudieron cargar los invitados');
        this.cargando.set(false);
      }
    });
  }
}