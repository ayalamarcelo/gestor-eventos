import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'eventos',
        pathMatch: 'full'
    },
    {
        path: 'eventos',
        loadComponent: () => 
           import('./components/event-list/event.list')
           .then(m => m.eventList)
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
    {
        path: 'invitacion/:codigo',
        loadComponent: () => 
            import('./components/invitation-card/invitation-card')
            .then(m => m.InvitationCard)
    },
    {
        path: '**',
        redirectTo: 'eventos'
    }
];