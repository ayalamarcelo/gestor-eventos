import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { event, newEvent } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class eventService {
  private http = inject(HttpClient);

  getAll(): Observable<event[]> {
    return this.http.get<event[]>(`${API_URL}/eventos`);
  }

  create(evento: newEvent): Observable<event> {
    return this.http.post<event>(`${API_URL}/eventos`, evento);
  }

  getById(id: number): Observable<event>{
    return this.http.get<event>(`${API_URL}/eventos/${id}`);
  }

  update(id: number, datos: Partial<newEvent>): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${API_URL}/eventos/${id}`, datos);
  }

  delete(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${API_URL}/eventos/${id}`);
  }
  
}