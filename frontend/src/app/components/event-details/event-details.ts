import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { eventService } from '../../services/event.service';
import { event } from '../../models/event.model';

const aInputLocal = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
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

  private readonly _eventService = inject(eventService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    fecha_hora: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] })
  });

  ngOnInit(): void {
    const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El id del evento no es válido');
      return;
    }

    this._eventService.getById(id).subscribe({
      next: (data) => {
        this.evento.set(data);
        this.form.patchValue({
          titulo: data.titulo,
          descripcion: data.descripcion ?? '',
          fecha_hora: aInputLocal(data.fecha_hora),
          direccion: data.direccion
        });
      },
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar el evento')
    });
  }
}