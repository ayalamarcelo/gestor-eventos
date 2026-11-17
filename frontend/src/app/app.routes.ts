import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';
import { EventDetails } from './components/event-details/event-details';
import { PanelOrganizador } from './components/panel-organizador/panel-organizador';


export const routes: Routes = [
    {
        path: 'eventos/:id',
        component: EventDetails,
        data: { volver: { ruta: '/events', texto: 'Mis eventos' } }
    },
    { 
        path: 'events', 
        component: eventList
    },
    { 
        path: 'panel', 
        component: PanelOrganizador
    },
    { 
        path: '', 
        redirectTo: 'events', 
        pathMatch: 'full'
    }
];
