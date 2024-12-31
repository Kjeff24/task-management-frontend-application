import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Task Management | Home',
    },
    {
        path: 'code',
        component: AuthComponent,
        title: 'Task Management | Authorized',
    },
];
