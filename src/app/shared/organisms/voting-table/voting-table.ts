import { Component, computed, input, output, signal } from '@angular/core';
import { Player, GameStatus } from '../../../core/models/game.model';
import { PlayerCardComponent } from '../../molecules/player-card/player-card';
import { CountingStateComponent } from '../../molecules/counting-state/counting-state';
import { ButtonComponent } from '../../atoms/button/button';

const ELLIPSE_RATIO = 345 / 603;

@Component({
  selector: 'app-voting-table',
  standalone: true,
  imports: [PlayerCardComponent, CountingStateComponent, ButtonComponent],
  templateUrl: './voting-table.html',
  styleUrl: './voting-table.css'
})
export class VotingTableComponent {
  readonly players = input<Player[]>([]);
  readonly currentUserId = input<string>('');
  readonly gameStatus = input<GameStatus>('voting');
  readonly isAdmin = input<boolean>(false);
  readonly hasAnyVote = input<boolean>(false);

  readonly revealCards = output<void>();
  readonly resetGame = output<void>();
  readonly promotePlayer = output<string>();

  readonly openMenuPlayerId = signal<string | null>(null);

  readonly allVoted = computed(() => {
    const activePlayers = this.players().filter(p => p.mode !== 'spectator');
    return activePlayers.length > 0 && activePlayers.every(p => p.selectedCard !== null);
  });

  readonly showCountingState = computed(() => {
    return this.gameStatus() === 'counting';
  });

  readonly showRevealButton = computed(() => {
    return this.gameStatus() === 'voting' && this.allVoted() && this.isAdmin();
  });

  getMenuDirection(index: number, total: number): 'up' | 'down' {
    const angle = this.getAngle(index, total);
    return Math.sin(angle) < 0 ? 'down' : 'up';
  }

  getCardState(player: Player): 'empty' | 'selected' | 'revealed' {
    if (!player.selectedCard) return 'empty';
    return this.gameStatus() === 'revealed' ? 'revealed' : 'selected';
  }

  getAngle(index: number, total: number): number {
    if (total === 0) return 0;

    const capped = Math.min(total, 8);
    const step = (2 * Math.PI) / capped;
    const raw = Math.PI / 2 + step * index;

    return Math.atan2(
      Math.sin(raw) / ELLIPSE_RATIO,
      Math.cos(raw)
    );
  }
}