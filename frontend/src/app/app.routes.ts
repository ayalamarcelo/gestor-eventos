import { Routes } from '@angular/router';
import { eventList } from './events/event.list';

export const routes: Routes = [
    { path: 'event', component: eventList },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
];
