import { Routes } from '@angular/router';
import { eventList } from './components/event-list/event.list';

export const routes: Routes = [
    { path: 'events', component: eventList },
    { path: '', redirectTo: 'events', pathMatch: 'full' }
];
