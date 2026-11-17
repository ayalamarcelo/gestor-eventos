import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Resumen {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getConfirmaciones(eventoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/eventos/${eventoId}/confirmaciones`);
  }
}