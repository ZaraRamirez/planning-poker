import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CreateGameFormComponent } from '../../shared/organisms/create-game-form/create-game-form';
import { HeaderComponent } from '../../shared/organisms/header/header';
import { UserFormComponent } from '../../shared/organisms/user-form/user-form';
import { GameStore } from '../../core/stores/game.store';
import { PlayerMode } from '../../core/models/game.model';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CreateGameFormComponent, HeaderComponent, UserFormComponent],
  templateUrl: './create-game.html',
  styleUrl: './create-game.css'
})
export class CreateGameComponent {
  @ViewChild('splashLogo') splashLogo!: ElementRef<HTMLImageElement>;

  readonly showSplash = signal(true);
  readonly isLeaving = signal(false);
  readonly logoTransform = signal('');
  readonly showUserForm = signal(false);

  constructor(
    private readonly router: Router,
    private readonly gameStore: GameStore
  ) { }

  onScreenClick(): void {
    const logoEl = this.splashLogo.nativeElement;
    const from = logoEl.getBoundingClientRect();
    const toX = 32;
    const toY = 24;
    const deltaX = toX - from.left - from.width / 2 + 20;
    const deltaY = toY - from.top - from.height / 2 + 20;
    this.logoTransform.set(`translate(${deltaX}px, ${deltaY}px) scale(0.625)`);
    this.isLeaving.set(true);
    setTimeout(() => this.showSplash.set(false), 800);
  }

  onGameCreated(gameName: string): void {
    this.gameStore.createGame(gameName);
    this.router.navigate(['/game']);
  }

  onUserCreated(data: { name: string; mode: PlayerMode }): void {
    this.gameStore.addAdminPlayer(data.name, data.mode);
    this.router.navigate(['/game']);
  }
}