import { Routes } from '@angular/router';
import { eventList } from '../app/components/event-list/event.list';

export const routes: Routes = [
    { path: 'events', component: eventList },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
];
