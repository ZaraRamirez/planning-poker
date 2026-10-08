import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameLayoutComponent } from '../../shared/templates/game-layout/game-layout';
import { HeaderComponent } from '../../shared/organisms/header/header';
import { UserFormComponent } from '../../shared/organisms/user-form/user-form';
import { InviteModalComponent } from '../../shared/organisms/invite-modal/invite-modal';
import { VotingTableComponent } from '../../shared/organisms/voting-table/voting-table';
import { CardPoolComponent } from '../../shared/organisms/card-pool/card-pool';
import { VoteSummaryComponent } from '../../shared/molecules/vote-summary/vote-summary';
import { GameStore } from '../../core/stores/game.store';
import { Card } from '../../core/models/game.model';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [
    GameLayoutComponent,
    HeaderComponent,
    UserFormComponent,
    InviteModalComponent,
    VotingTableComponent,
    CardPoolComponent,
    VoteSummaryComponent,
  ],
  templateUrl: './game-room.html',
  styleUrl: './game-room.css'
})
export class GameRoomComponent implements OnInit {
  private gameStore = inject(GameStore);
  private route = inject(ActivatedRoute);

  readonly showInviteModal = signal(false);
  readonly isJoining = signal(false);
  readonly gameIdFromUrl = signal<string | null>(null);

  readonly gameName = this.gameStore.gameName;
  readonly players = this.gameStore.players;
  readonly inviteLink = this.gameStore.inviteLink;
  readonly currentPlayer = this.gameStore.currentPlayer;
  readonly currentUserHasVoted = this.gameStore.currentUserHasVoted;
  readonly currentUserCanVote = this.gameStore.currentUserCanVote;
  readonly gameStatus = this.gameStore.status;
  readonly availableCards = this.gameStore.availableCards;
  readonly isAdmin = this.gameStore.isCurrentUserAdmin;
  readonly hasAnyVote = this.gameStore.hasAnyVote;

  readonly voteGroups = this.gameStore.voteGroups;
  readonly currentPlayerMode = this.gameStore.currentPlayerMode;
  readonly cardModes = this.gameStore.cardModes;
  readonly currentCardModeId = this.gameStore.currentCardModeId;
  readonly average = this.gameStore.average;

  readonly gameExists = computed(() => this.gameStore.game() !== null);
  readonly currentUserId = computed(() => this.currentPlayer()?.id ?? '');
  readonly showUserForm = computed(() => !this.currentPlayer());

  readonly selectedCardId = computed(() => {
    const player = this.currentPlayer();
    return player?.selectedCard?.id ?? null;
  });

  readonly showCardPool = computed(() => {
    const player = this.currentPlayer();
    if (!player) return false;
    return player.mode === 'player' && this.gameStore.status() === 'voting';
  });

  readonly showVoteSummary = computed(() => this.gameStore.status() === 'revealed');

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameIdFromUrl.set(gameId);
      this.isJoining.set(true);

      const currentPlayer = this.gameStore.currentPlayer();

      const isReturningPlayer = currentPlayer !== null
        && currentPlayer.role !== 'admin';

      if (!isReturningPlayer) {
        this.gameStore.clearCurrentPlayer();
      }
    }
  }

  onUserCreated(data: { name: string; mode: 'player' | 'spectator' }): void {
    if (this.isJoining() && this.gameIdFromUrl()) {
      this.gameStore.joinGame(this.gameIdFromUrl()!, data.name, data.mode);
    } else {
      this.gameStore.addAdminPlayer(data.name, data.mode);
    }
  }

  onCardSelected(card: Card): void {
    const userId = this.currentUserId();
    if (userId && this.currentUserCanVote()) {
      this.gameStore.updatePlayerVote(userId, card);
    }
  }

  onRevealCards(): void {
    this.gameStore.revealCards();
  }

  onCardModeChange(modeId: string): void {
    this.gameStore.setCardMode(modeId);
  }

  onModeChange(mode: 'player' | 'spectator'): void {
    const userId = this.currentUserId();
    if (userId) {
      this.gameStore.updatePlayerMode(userId, mode);
    }
  }

  onPromotePlayer(playerId: string): void {
    this.gameStore.promoteToAdmin(playerId);
  }

  onResetGame(): void {
    this.gameStore.resetGame();
  }

  onInviteClick(): void {
    this.showInviteModal.set(true);
  }

  onCloseInvite(): void {
    this.showInviteModal.set(false);
  }
}