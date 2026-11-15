import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';
import { EventDetails } from './components/event-details/event-details';
import { Invitados } from './components/guests/guests';
import { eventForm } from './components/event-form/event-form';
import { PanelOrganizador } from './components/panel-organizador/panel-organizador';


export const routes: Routes = [
<<<<<<< HEAD
    {
        path: '',
        redirectTo: 'eventos',
        pathMatch: 'full'
    },
    {
        path: 'eventos',
        component: eventList,
        data: { volver: { texto: 'Inicio', ruta: '/' } }
    },
    {
        path: 'eventos/nuevo',
        component: eventForm,
        data: { volver: { texto: 'Mis eventos', ruta: '/eventos' } }
    },
    {
        path: 'eventos/:id',
        component: EventDetails,
        data: { volver: { ruta: '/eventos/:id/asistencias', texto: 'Volver' } }
    },
    {
        path: 'eventos/:id/asistencias',
        component: PanelOrganizador,
        data: { volver: { ruta: '/eventos', texto: 'Mis eventos' } }
    },
    {
        path: 'eventos/:id/invitados',
        component: Invitados,
        data: { volver: { ruta: '/eventos/:id/asistencias', texto: 'Volver' } }
    },
=======
    { path: 'events', component: eventList },
    {
        path: 'invitacion/:codigo',
        loadComponent: () => import('./components/invitation-card/invitation-card').then(m => m.InvitationCard)
    },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
>>>>>>> 773e0d6 (feat: agregar componente invitation-card y su ruta con el código en la URL)
];
