import { Component, input, output, signal, computed } from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar';
import { capitalizeName } from '../../../core/utils/game.utils';
import { PlayerMode, GameStatus } from '../../../core/models/game.model';
import { CardMode } from '../../../core/models/card-mode.model';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenuComponent {
  readonly userName = input<string>('');
  readonly isAdmin = input<boolean>(false);
  readonly currentMode = input<PlayerMode>('player');
  readonly cardModes = input<CardMode[]>([]);
  readonly currentCardModeId = input<string>('');
  readonly gameStatus = input<GameStatus>('voting');

  readonly modeChange = output<PlayerMode>();
  readonly cardModeChange = output<string>();

  readonly showMenu = signal(false);

  readonly displayName = computed(() => capitalizeName(this.userName()));

  readonly isCardModeDisabled = computed(() =>
    this.gameStatus() === 'revealed' || this.gameStatus() === 'counting'
  );

  onAvatarClick(): void {
    this.showMenu.update(v => !v);
  }

  onModeSelect(mode: PlayerMode): void {
    this.modeChange.emit(mode);
    this.showMenu.set(false);
  }

  onCardModeSelect(modeId: string): void {
    if (this.isCardModeDisabled()) return;
    this.cardModeChange.emit(modeId);
  }

  onCloseMenu(): void {
    this.showMenu.set(false);
  }
}