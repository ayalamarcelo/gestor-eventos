<<<<<<< HEAD
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
=======
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { PanelOrganizador } from './components/panel-organizador/panel-organizador';
>>>>>>> 80942ac (feat: agrega carpeta components)

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  template: `<router-outlet />`,
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
    return ruta.data['volver'] ?? null;
  }
}
