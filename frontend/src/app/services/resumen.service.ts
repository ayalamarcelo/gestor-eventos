import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Service()
export class Resumen {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;


  getResumenPanel(): Observable<any> {
    return this.http.get(`${this.apiUrl}/organizador/resumen`);
  }
}
