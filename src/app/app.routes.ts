import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/create-game/create-game').then(m => m.CreateGameComponent)
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./pages/game-room/game-room').then(m => m.GameRoomComponent)
  },
  {
    path: 'game/:id',
    loadComponent: () =>
      import('./pages/game-room/game-room').then(m => m.GameRoomComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];