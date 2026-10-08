import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button';
import { UserMenuComponent } from '../../molecules/user-menu/user-menu';
import { PlayerMode, GameStatus } from '../../../core/models/game.model';
import { CardMode } from '../../../core/models/card-mode.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent, UserMenuComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  readonly gameName = input<string>('');
  readonly userName = input<string>('');
  readonly inline = input<boolean>(false);
  readonly isAdmin = input<boolean>(false);
  readonly currentMode = input<PlayerMode>('player');
  readonly cardModes = input<CardMode[]>([]);
  readonly currentCardModeId = input<string>('');
  readonly gameStatus = input<GameStatus>('voting');

  readonly inviteClick = output<void>();
  readonly modeChange = output<PlayerMode>();
  readonly cardModeChange = output<string>();

  onInviteClick(): void {
    this.inviteClick.emit();
  }
}