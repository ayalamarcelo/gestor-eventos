import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InvitadoResponse {
  id: number;
  codigo: string;
  nombre: string;
  ya_confirmo: boolean;
  asiste: boolean | number | null;
  cantidad_acompanantes?: number | null;
  restriccion: string | null;
  detalle_restriccion?: string | null;
}

@Service()
export class ResumenService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getConfirmaciones(eventoId: number): Observable<InvitadoResponse[]> {
    return this.http.get<InvitadoResponse[]>(`${this.apiUrl}/eventos/${eventoId}/confirmaciones`);
  }
}