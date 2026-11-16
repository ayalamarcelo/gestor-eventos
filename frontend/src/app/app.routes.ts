import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';
import { EventDetails } from './components/event-details/event-details';


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
        path: '', 
        redirectTo: 'events', 
        pathMatch: 'full'
    }
];
