import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';
import { EventDetails } from './components/event-details/event-details';
import { Invitados } from './components/guests/guests';
import { eventForm } from './components/event-form/event-form';


export const routes: Routes = [
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
        path: '', 
        redirectTo: 'eventos', 
        pathMatch: 'full' 
    },
    {
        path: 'eventos/:id/invitados',
        component: Invitados,
        data: { volver: { ruta: '/eventos', texto: 'Mis eventos' } }
    },
    {
        path: 'eventos/:id',
        component: EventDetails,
        data: { volver: { ruta: '/eventos', texto: 'Mis eventos' } }
    },
];
