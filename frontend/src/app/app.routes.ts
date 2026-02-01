import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/oligo',
    pathMatch: 'full',
  },
  {
    path: 'oligo',
    loadComponent: () =>
      import('./pages/composition-visualisation-by-kmers/composition-visualisation-by-kmers').then(
        (m) => m.CompositionVisualisationByKmers,
      ),
  },
  {
    path: 'cgr',
    loadComponent: () =>
      import('./pages/composition-visualisation-by-cgr/composition-visualisation-by-cgr').then(
        (m) => m.CompositionVisualisationByCgr,
      ),
  },
];
