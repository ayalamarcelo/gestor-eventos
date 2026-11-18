import { Routes } from '@angular/router';
import { Home } from './components/home/home';

export const routes: Routes = [
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f621c28 (refactor: estructura ruteo, borra service sin uso)
    {
        path: '',
        component: Home,
    },
    {
        path: 'eventos',
        loadComponent: () => 
           import('./components/event-list/event.list')
           .then(m => m.eventList),
           data: { volver: { texto: 'Inicio', ruta: '/' } }
    },
    {
        path: 'eventos/nuevo',
        loadComponent: () => 
            import('./components/event-form/event-form')
            .then(m => m.eventForm),
            data: { volver: { texto: 'Mis eventos', ruta: '/eventos' } }
    },
    {
        path: 'eventos/:id',
        loadComponent: () =>
            import('./components/event-details/event-details')
            .then(m => m.EventDetails),
            data: { volver: { ruta: '/eventos/:id/asistencias', texto: 'Volver' } }
    },
    {
        path: 'eventos/:id/asistencias',
        loadComponent: () => 
            import('./components/panel-organizador/panel-organizador')
            .then(m => m.PanelOrganizador),
            data: { volver: { ruta: '/eventos', texto: 'Mis eventos' } }
    },
    {
        path: 'eventos/:id/invitados',
        loadComponent: () => 
            import('./components/guests/guests')
            .then(m => m.Invitados),
            data: { volver: { ruta: '/eventos/:id/asistencias', texto: 'Volver' } }
    },
<<<<<<< HEAD
=======
    { path: 'events', component: eventList },
    {
        path: 'invitacion/:codigo',
        loadComponent: () => import('./components/invitation-card/invitation-card').then(m => m.InvitationCard)
    },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
>>>>>>> 773e0d6 (feat: agregar componente invitation-card y su ruta con el código en la URL)
];
=======
    {
        path: 'invitacion/:codigo',
        loadComponent: () => 
            import('./components/invitation-card/invitation-card')
            .then(m => m.InvitationCard)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
>>>>>>> f621c28 (refactor: estructura ruteo, borra service sin uso)
