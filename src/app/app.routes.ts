import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { adminGuard } from './guards/admin/admin.guard';
export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Task Management | Home',
    },
    {
        path: 'users',
        component: UsersComponent,
        title: 'Task Management | Users',
        canActivate: [adminGuard]
    },
];
