import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Invitacion } from '../models/invitation.model';
import { API_URL } from '../api.config';

@Service()
export class InvitationService {
    private readonly _httpClient = inject(HttpClient)

    public invitacionPorCodigoService(codigo: string) : Observable<Invitacion>{
        return this._httpClient.get<Invitacion>(`${API_URL}/invitaciones/${encodeURIComponent(codigo)}`)
    }
}

