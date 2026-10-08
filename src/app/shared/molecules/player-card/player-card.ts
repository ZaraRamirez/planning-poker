import { Component, input, output, computed } from '@angular/core';
import { CardComponent, CardState, CardVariant } from '../../atoms/card/card';
import { AvatarComponent } from '../../atoms/avatar/avatar';
import { Card } from '../../../core/models/game.model';
import { capitalizeName } from '../../../core/utils/game.utils';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CardComponent, AvatarComponent],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css'
})
export class PlayerCardComponent {
  readonly playerName = input<string>('');
  readonly cardState = input<CardState>('empty');
  readonly cardValue = input<Card | null>(null);
  readonly isSpectator = input<boolean>(false);
  readonly isCurrentUser = input<boolean>(false);
  readonly cardVariant = input<CardVariant>('table');
  readonly isAdmin = input<boolean>(false);
  readonly isPlayerAdmin = input<boolean>(false);
  readonly menuDirection = input<'up' | 'down'>('up');
  readonly isMenuOpen = input<boolean>(false);

  readonly promotePlayer = output<void>();
  readonly menuToggle = output<void>();

  readonly displayName = computed(() => capitalizeName(this.playerName()));

  readonly canPromote = computed(() =>
    this.isAdmin() && !this.isCurrentUser() && !this.isPlayerAdmin()
  );

  onCardClick(): void {
    if (this.canPromote()) {
      this.menuToggle.emit();
    }
  }

  onPromote(): void {
    this.promotePlayer.emit();
  }

  onCloseMenu(): void {
    this.menuToggle.emit();
  }
}