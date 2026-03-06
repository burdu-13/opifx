import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/editor/container/editor-container').then((c) => c.EditorContainer),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
