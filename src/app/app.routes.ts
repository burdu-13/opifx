import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/editor/container/editor-container').then((c) => c.EditorContainer),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/editor/components/upload-step/upload-step').then((c) => c.UploadStep),
      },
      {
        path: 'edit',
        loadComponent: () => import('./features/editor/components/edit-step/container/edit-step').then((c) => c.EditStep),
      },
      {
        path: 'export',
        loadComponent: () => import('./features/editor/components/export-step/container/export-step-container').then((c) => c.ExportStepContainer),
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
