import { Routes } from '@angular/router';
import { AppLayout } from './layout/container/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        title: 'OPIFX - Workspace',
        loadComponent: () => import('./features/editor/container/editor-container').then(c => c.EditorContainer),
      },
      {
        path: 'export',
        title: 'OPIFX - Render',
        loadComponent: () => import('./features/editor/components/export-step/container/export-step-container').then(c => c.ExportStepContainer),
      }
    ]
  },
  { path: '**', redirectTo: '' }
];