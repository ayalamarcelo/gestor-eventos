import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { eventService } from '../../services/event.service';
import { event } from '../../models/event.model';

@Component({
  selector: 'app-eventos-lista',
  imports: [DatePipe, RouterLink],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class eventList implements OnInit {
  private eventService = inject(eventService);

  events = signal<event[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos. Verificá tu conexión y reintentá.');
        this.loading.set(false);
      }
    });
  }

  esProximo(e: event) {
    return new Date(e.fecha_hora).getTime() >= Date.now();
  }
}