import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Confirmacion, ConfirmacionRequest } from '../models/invitation.model';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';

@Service()
export class ConfirmationService {
    private readonly _httpClient = inject(HttpClient)

    public crearConfimacionService(codigo:string, datos:ConfirmacionRequest ) : Observable<Confirmacion>{
        return this._httpClient.post<Confirmacion>(`${API_URL}/invitaciones/${encodeURIComponent(codigo)}/confirmacion`, datos)
    }

}
