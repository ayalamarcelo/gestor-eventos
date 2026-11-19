import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { eventService } from '../../services/event.service';
import { InvitadoService } from '../../services/guests.service';
import { event } from '../../models/event.model';
import { FilaInvitado } from '../../models/guest.model';

@Component({
  selector: 'app-panel-organizador',
  imports: [DatePipe, NgClass, RouterLink, ReactiveFormsModule],
  templateUrl: './panel-organizador.html',
  styleUrl: './panel-organizador.css'
})
export class PanelOrganizador implements OnInit {
  private readonly eventService = inject(eventService);
  private readonly invitadoService = inject(InvitadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  
  readonly errorEdicion = signal<string | null>(null);
  readonly opcionesAcompanantes = [0, 1, 2, 3, 4, 5];

  readonly formulario = this.fb.nonNullable.group({
    asiste: true,
    cantidad: 0,
    restriccion: 'ninguna',
    detalle: ''
  });

  readonly eventoId = signal(0);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly evento = signal<event | null>(null);
  readonly invitados = signal<FilaInvitado[]>([]);
  readonly filtroEstado = signal('todos');


  readonly invitadosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    return this.invitados().filter(i => estado === 'todos' || i.estado.toLowerCase() === estado);
  });

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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El id del evento no es válido');
      this.cargando.set(false);
      return;
    }
    this.eventoId.set(id);

    this.eventService.getById(id).subscribe({
      next: (data) => this.evento.set(data),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar el evento')
    });

    this.cargarInvitados();
  }

  cargarInvitados() {
    this.invitadoService.obtenerInvitados(this.eventoId()).subscribe({
      next: (invitados) => {
        const listaCruda = invitados as unknown as Array<{
          id: number;
          codigo: string;
          nombre: string;
          ya_confirmo: boolean;
          asiste?: boolean | number | null;
          cantidad_acompanantes?: number | null;
          restriccion?: string | null;
          detalle_restriccion?: string | null;
        }>;

        this.invitados.set(listaCruda.map((i) => ({
          id: i.id,
          codigo: i.codigo,
          nombre: i.nombre,
          iniciales: i.nombre.split(' ').filter(p => p !== '').slice(0, 2).map(p => p[0].toUpperCase()).join(''),
          yaConfirmo: i.ya_confirmo,
          asiste: !!i.asiste,
          acompanantes: i.cantidad_acompanantes ?? 0,
          restriccion: i.restriccion ?? null,
          detalle: i.detalle_restriccion ?? null,
          estado: !i.ya_confirmo ? 'Pendiente' : i.asiste ? 'Asiste' : 'No asiste'
        })));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los invitados');
        this.cargando.set(false);
      }
    });
  }
}