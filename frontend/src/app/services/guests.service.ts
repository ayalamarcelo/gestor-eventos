import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Invitado, InvitadoCreado } from '../models/guest.model';

@Service()
export class InvitadoService {
  private readonly _http = inject(HttpClient);

  obtenerInvitados(eventoId: string | number): Observable<Invitado[]> {
    return this._http.get<Invitado[]>(`${API_URL}/eventos/${eventoId}/invitados`);
  }

  crearInvitado(eventoId: string | number, nombre: string): Observable<InvitadoCreado> {
    return this._http.post<InvitadoCreado>(`${API_URL}/eventos/${eventoId}/invitados`, { nombre });
  }
}