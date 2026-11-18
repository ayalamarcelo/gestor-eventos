import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { eventService } from '../../services/event.service';
import { event } from '../../models/event.model';

const aInputLocal = (iso: string) => {
  const fecha = new Date(iso);
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-event-details',
  styleUrl: './event-details.css',
  templateUrl: './event-details.html',
})
export class EventDetails implements OnInit {
  readonly evento = signal<event | null>(null);
  readonly error = signal<string | null>(null);

  private readonly eventService = inject(eventService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  readonly guardando = signal(false);
  readonly exito = signal<string | null>(null);
  readonly errorGuardar = signal<string | null>(null);


  form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    fecha_hora: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] })
  });

  ngOnInit(): void {
    this.cargarEvento();
  }


  cargarEvento() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El id del evento no es válido');
      return;
    }

    this.error.set(null);

    this.eventService.getById(id).subscribe({
      next: (data) => {
        this.evento.set(data);
        this.form.patchValue({
          titulo: data.titulo,
          descripcion: data.descripcion ?? '',
          fecha_hora: aInputLocal(data.fecha_hora),
          direccion: data.direccion
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      },
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar el evento')
    });
  }

  guardar() {
    const eventoActual = this.evento();
    if (!eventoActual) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValidado = this.form.getRawValue();
    const datos = {
      titulo: formValidado.titulo,
      descripcion: formValidado.descripcion || null,
      fecha_hora: new Date(formValidado.fecha_hora).toISOString(),
      direccion: formValidado.direccion
    };

    this.guardando.set(true);
    this.exito.set(null);
    this.errorGuardar.set(null);

    this.eventService.update(eventoActual.id, datos).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.exito.set(res.mensaje);
        this.cargarEvento();
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorGuardar.set(err.error?.error ?? 'No se pudo guardar el evento');
      }
    });
  }
 
  borrar() {
    const eventoActual = this.evento();
    if (!eventoActual) return;

    if (!confirm(`¿Seguro que querés borrar "${eventoActual.titulo}"? No se puede deshacer.`)) return;

    this.eventService.delete(eventoActual.id).subscribe({
      next: () => this.router.navigate(['/eventos']),
      error: (err) => this.errorGuardar.set(err.error?.error ?? 'No se pudo borrar el evento')
    });
  }
}