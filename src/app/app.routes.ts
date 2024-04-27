import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'chat/:userId',
        loadChildren: () => import('./modules/components/routes').then(m => m.routes)
    }
];
