import { Routes } from '@angular/router';
import { PanelOrganizador } from './components/panel-organizador/panel-organizador';

export const routes: Routes = [
    {
        path: 'panel',
        component: PanelOrganizador
    },
    {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
    }
];
