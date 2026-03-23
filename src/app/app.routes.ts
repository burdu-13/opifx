import { Routes } from '@angular/router';
import { AppLayout } from './layout/container/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full' },
      {
        path: 'edit',
        title: 'Opifx | Studio',
        loadComponent: () =>
          import('./features/editor/components/edit-step/container/edit-step').then(
            (c) => c.EditStep,
          ),
      },
      {
        path: 'batch',
        title: 'Opifx | Batch Mode',
        loadComponent: () =>
          import('./features/batch/container/batch-step').then((c) => c.BatchStepContainer),
      },
      {
        path: 'export',
        title: 'Opifx | Render',
        loadComponent: () =>
          import('./features/editor/components/export-step/container/export-step-container').then(
            (c) => c.ExportStepContainer,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
