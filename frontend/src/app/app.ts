import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('The Gathering');
  private readonly _router = inject(Router);

  volverActual() {
    let ruta = this._router.routerState.snapshot.root;
    while (ruta.firstChild) {
      ruta = ruta.firstChild;
    }

    const volver = ruta.data['volver'];
    if (!volver) {
      return null;
    }

    return {
      texto: volver.texto,
      ruta: volver.ruta.replace(':id', ruta.paramMap.get('id') ?? '')
    };
  }
}
