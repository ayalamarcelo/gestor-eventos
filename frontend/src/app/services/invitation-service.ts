import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Confirmacion, ConfirmacionRequest, Invitacion } from '../models/invitation.model';
import { API_URL } from '../api.config';

@Service()
export class InvitationService {
    private readonly _httpClient = inject(HttpClient)

    public invitacionPorCodigoService(codigo: string) : Observable<Invitacion>{
        return this._httpClient.get<Invitacion>(`${API_URL}/invitaciones/${encodeURIComponent(codigo)}`)
    }

    public actualizarConfirmacionService(codigo: string, datos: ConfirmacionRequest) : Observable<Confirmacion>{
        return this._httpClient.put<Confirmacion>(`${API_URL}/invitados/${encodeURIComponent(codigo)}/confirmacion`, datos)
    } 
}

