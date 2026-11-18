import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Invitado } from '../models/guest.model';

@Service()
export class InvitadoService {
    private readonly http = inject(HttpClient);

    obtenerInvitados(eventoId: string | number): Observable<Invitado[]> {
        return this.http.get<Invitado[]>(`${API_URL}/eventos/${eventoId}/invitados`);
    }

    crearInvitado(eventoId: string | number, nombre: string): Observable<Invitado> {
        return this.http.post<Invitado>(`${API_URL}/eventos/${eventoId}/invitados`, { nombre });
    }

    eliminarInvitado(eventoId: string | number, invitadoId: number): Observable<void> {
        return this.http.delete<void>(`${API_URL}/eventos/${eventoId}/invitados/${invitadoId}`);
    }

    crearConfirmacion(codigo: string, datos: object): Observable<unknown> {
        return this.http.post(`${API_URL}/invitaciones/${codigo}/confirmacion`, datos);
    }
    
    actualizarConfirmacion(eventoId: number, invitadoId: number, datos: object): Observable<unknown> {
        return this.http.put(`${API_URL}/eventos/${eventoId}/invitados/${invitadoId}/confirmacion`, datos);
    }

    eliminarConfirmacion(eventoId: number, invitadoId: number): Observable<void> {
        return this.http.delete<void>(`${API_URL}/eventos/${eventoId}/invitados/${invitadoId}/confirmacion`);
    }
}