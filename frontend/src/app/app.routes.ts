import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';

export const routes: Routes = [
    { path: 'events', component: eventList },
    {
        path: 'invitacion/:codigo',
        loadComponent: () => import('./components/invitation-card/invitation-card').then(m => m.InvitationCard)
    },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
];
