import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';
import { EventDetails } from './components/event-details/event-details';
import { Invitados } from './components/guests/guests';


export const routes: Routes = [
    { path: 'events', component: eventList },
    { path: '', redirectTo: 'events', pathMatch: 'full' },
    {
        path: 'eventos/:id/invitados',
        component: Invitados,
        data: { volver: { ruta: '/events', texto: 'Mis eventos' } }
    },
    {
        path: 'eventos/:id',
        component: EventDetails,
        data: { volver: { ruta: '/events', texto: 'Mis eventos' } }
    },
];
