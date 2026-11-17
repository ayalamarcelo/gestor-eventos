import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { eventService } from '../../services/event.service';

@Component({
  selector: 'app-evento-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css'
})
export class eventForm {
  private eventService = inject(eventService);
  private router = inject(Router);

  sending = signal(false);
  error = signal<string | null>(null);

  form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    fecha_hora: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] })
  });

  send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();

    const fecha = new Date(v.fecha_hora);
    if (isNaN(fecha.getTime())) {
      this.error.set('La fecha no es válida');
      return;
    }

    this.sending.set(true);
    this.error.set(null);

    this.eventService.create({
      titulo: v.titulo,
      descripcion: v.descripcion || null,
      fecha_hora: fecha.toISOString(),
      direccion: v.direccion
    }).subscribe({
      next: () => {
        this.sending.set(false);
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'No se pudo crear el evento');
        this.sending.set(false);
      }
    });
  }
}