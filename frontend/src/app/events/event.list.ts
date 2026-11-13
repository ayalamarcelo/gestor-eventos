import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { eventService } from './event.service';
import { event } from './event.model';
import { eventForm } from './event-form';

@Component({
  selector: 'app-eventos-lista',
  imports: [DatePipe, eventForm],
  templateUrl: './event-list.html'
})
export class eventList implements OnInit {
  private eventService = inject(eventService);

  events = signal<event[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loading();
  }

  cargar() {
    this.loading.set(true);
    this.error.set(null);
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos');
        this.loading.set(false);
      }
    });
  }
}