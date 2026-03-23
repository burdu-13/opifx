import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Opifx | Image Editor',
    loadComponent: () =>
      import('./features/editor/container/editor-container').then((c) => c.EditorContainer),
    children: [
      {
        path: '',
        title: 'Opifx | Homepage',
        loadComponent: () =>
          import('./features/editor/components/upload-step/upload-step').then((c) => c.UploadStep),
      },
      {
        path: 'edit',
        title: 'Opifx | Atmosphere & Adjustments',
        loadComponent: () =>
          import('./features/editor/components/edit-step/container/edit-step').then(
            (c) => c.EditStep,
          ),
      },
      {
        path: 'export',
        title: 'Opifx | Render & Finalize',
        loadComponent: () =>
          import('./features/editor/components/export-step/container/export-step-container').then(
            (c) => c.ExportStepContainer,
          ),
      },
      {
        path: 'batch',
        title: 'Opifx | Batch Mode',
        loadComponent: () =>
          import('./features/batch/container/batch-step').then((c) => c.BatchStepContainer),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
