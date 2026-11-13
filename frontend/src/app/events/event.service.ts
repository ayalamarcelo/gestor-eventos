import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { event, newEvent } from './event.model';

@Injectable({ providedIn: 'root' })
export class eventService {
  private http = inject(HttpClient);

  getAll(): Observable<event[]> {
    return this.http.get<event[]>(`${API_URL}/eventos`);
  }

  create(evento: newEvent): Observable<event> {
    return this.http.post<event>(`${API_URL}/eventos`, evento);
  }
}