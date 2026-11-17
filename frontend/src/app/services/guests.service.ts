import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Invitado } from '../models/guest.model';

@Service()
export class InvitadoService {
    private readonly _http = inject(HttpClient);

    obtenerInvitados(eventoId: string | number): Observable<Invitado[]> {
        return this._http.get<Invitado[]>(`${API_URL}/eventos/${eventoId}/invitados`);
    }

    crearInvitado(eventoId: string | number, nombre: string): Observable<Invitado> {
        return this._http.post<Invitado>(`${API_URL}/eventos/${eventoId}/invitados`, { nombre });
    }

    eliminarInvitado(eventoId: string | number, invitadoId: number): Observable<void> {
        return this._http.delete<void>(`${API_URL}/eventos/${eventoId}/invitados/${invitadoId}`);
    }
}