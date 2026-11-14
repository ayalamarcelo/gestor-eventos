import { Routes } from '@angular/router';
import { eventList } from '../app/events/event.list';

export const routes: Routes = [
    { path: 'events', component: eventList },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
];
