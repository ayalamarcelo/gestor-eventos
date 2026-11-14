import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { PanelOrganizador } from './components/panel-organizador/panel-organizador';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  template: `<router-outlet />`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
