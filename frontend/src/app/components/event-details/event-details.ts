import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eventService } from '../../services/event.service';
import { event } from '../../models/event.model';

@Component({
  imports: [],
  selector: 'app-event-details',
  styleUrl: './event-details.css',
  templateUrl: './event-details.html',
})
export class EventDetails implements OnInit {
  readonly evento = signal<event | null>(null);
  readonly error = signal<string | null>(null);

  private readonly _eventService = inject(eventService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El id del evento no es válido');
      return;
    }

    this._eventService.getById(id).subscribe({
      next: (data) => this.evento.set(data),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar el evento')
    });
  }
}
