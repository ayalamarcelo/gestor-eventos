import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { eventService } from '../../services/event.service';
import { InvitadoService } from '../../services/guests.service';
import { event } from '../../models/event.model';

interface FilaInvitado {
  id: number;
  codigo: string;
  nombre: string;
  iniciales: string;
  yaConfirmo: boolean;
  asiste: boolean;
  acompanantes: number;
  restriccion: string | null;
  detalle: string | null;
  estado: string;
}

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

  readonly editando = signal<FilaInvitado | null>(null);
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

  readonly nuevoNombre = signal('');
  readonly agregando = signal(false);
  readonly errorAgregar = signal<string | null>(null);

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
        this.invitados.set(invitados.map((i: any) => ({
          id: i.id,
          codigo: i.codigo,
          nombre: i.nombre,
          iniciales: i.nombre.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase(),
          yaConfirmo: i.ya_confirmo,
          asiste: !!i.asiste,
          acompanantes: i.cantidad_acompanantes ?? 0,
          restriccion: i.restriccion,
          detalle: i.detalle_restriccion ?? null,
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

  pideDetalle(): boolean {
    const restriccion = this.formulario.controls.restriccion.value;
    return this.formulario.controls.asiste.value && (restriccion === 'alergia' || restriccion === 'otra');
  }

  editar(fila: FilaInvitado) {
    this.errorEdicion.set(null);
    this.formulario.setValue({
      asiste: fila.yaConfirmo ? fila.asiste : true,
      cantidad: fila.acompanantes,
      restriccion: fila.restriccion ?? 'ninguna',
      detalle: fila.detalle ?? ''
    });
    this.editando.set(fila);
  }

  guardar() {
    const fila = this.editando();
    if (!fila) return;
    const f = this.formulario.getRawValue();

    const datos = f.asiste
      ? {
        asiste: true,
        cantidad_acompanantes: Number(f.cantidad),
        restriccion: f.restriccion,
        detalle_restriccion: this.pideDetalle() ? (f.detalle.trim() || null) : null
      }
      : { asiste: false, cantidad_acompanantes: 0, restriccion: 'ninguna', detalle_restriccion: null };

    const llamada = fila.yaConfirmo
      ? this.invitadoService.actualizarConfirmacion(this.eventoId(), fila.id, datos)
      : this.invitadoService.crearConfirmacion(fila.codigo, datos);

    llamada.subscribe({
      next: () => {
        this.editando.set(null);
        this.cargarInvitados();
      },
      error: (err) => this.errorEdicion.set(err.error?.error ?? 'No se pudo guardar')
    });
  }

  eliminarRespuesta(fila: FilaInvitado) {
    if (!confirm(`¿Borrar la respuesta de ${fila.nombre}? Volverá a estar pendiente.`)) return;
    this.invitadoService.eliminarConfirmacion(this.eventoId(), fila.id).subscribe({
      next: () => this.cargarInvitados(),
      error: (err) => this.errorEdicion.set(err.error?.error ?? 'No se pudo borrar')
    });
  }
}