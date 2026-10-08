import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { Game, Player, PlayerMode, Card } from '../models/game.model';
import { createInitialGame, createCards, DEFAULT_CARDS, computeVoteGroups, computeAverage, capitalizeName } from '../utils/game.utils';
import { CARD_MODES } from '../models/card-mode.model';

@Injectable({ providedIn: 'root' })
export class GameStore implements OnDestroy {

  private readonly _game = signal<Game | null>(null);
  private readonly _currentPlayerId = signal<string | null>(null);
  private readonly _cards = signal<Card[]>(DEFAULT_CARDS);
  private readonly _currentCardModeId = signal<string>(CARD_MODES[0].id);

  private readonly STORAGE_KEY = 'planning_poker_game';
  private readonly PLAYER_KEY = 'planning_poker_player_id';

  // Canal de comunicación entre pestañas del mismo origen
  private readonly channel = new BroadcastChannel('planning_poker');

  constructor() {
    const savedGame = this.loadFromStorage();
    if (savedGame) this._game.set(savedGame);

    // sessionStorage por pestaña (Cada pestaña recuerda su propio jugador)
    const savedPlayerId = sessionStorage.getItem(this.PLAYER_KEY);
    if (savedPlayerId) this._currentPlayerId.set(savedPlayerId);

    this.channel.onmessage = (event: MessageEvent<Game | null>) => {
      this._game.set(event.data);
    };
  }

  ngOnDestroy(): void {
    this.channel.close();
  }

  // Estado del juego 
  readonly game = computed(() => this._game());
  readonly gameName = computed(() => this._game()?.name ?? '');
  readonly players = computed(() => this._game()?.players ?? []);
  readonly status = computed(() => this._game()?.status ?? 'waiting');
  readonly inviteLink = computed(() => this._game()?.inviteLink ?? '');
  readonly voteGroups = computed(() => computeVoteGroups(this.players()));
  readonly average = computed(() => computeAverage(this.players()));
  readonly hasAnyVote = computed(() =>
    this.players().some(p => p.mode === 'player' && p.selectedCard !== null)
  );

  // Estado del jugador actual

  readonly currentPlayer = computed(() => {
    const id = this._currentPlayerId();
    return this.players().find(p => p.id === id) ?? null;
  });

  readonly isCurrentUserAdmin = computed(() =>
    this.currentPlayer()?.role === 'admin'
  );

  readonly currentUserHasVoted = computed(() =>
    this.currentPlayer()?.selectedCard != null
  );

  readonly currentUserCanVote = computed(() => {
    const player = this.currentPlayer();
    return player?.mode === 'player' && player?.selectedCard == null;
  });

  readonly currentPlayerMode = computed(() =>
    this.currentPlayer()?.mode ?? 'player'
  );

  // Estado de las cartas

  readonly availableCards = computed(() => this._cards());
  readonly cardModes = CARD_MODES;
  readonly currentCardModeId = computed(() => this._currentCardModeId());

  private saveToStorage(game: Game | null): void {
    if (game) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(game));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private loadFromStorage(): Game | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // Persiste el estado y lo sincroniza con todas las pestañas
  private persist(game: Game): void {
    this._game.set(game);
    this.saveToStorage(game);
    this.channel.postMessage(game);
  }

  // Acciones del juego

  createGame(gameName: string): void {
    const game = createInitialGame(gameName);
    this._game.set(game);
    this.saveToStorage(game);
  }

  addAdminPlayer(name: string, mode: PlayerMode): void {
    const game = this._game();
    if (!game) return;

    const adminPlayer: Player = {
      id: crypto.randomUUID(),
      name: capitalizeName(name),
      role: 'admin',
      mode,
      selectedCard: null
    };

    this.persist({ ...game, players: [adminPlayer], status: 'voting' });
    this.saveCurrentPlayer(adminPlayer.id);
  }

  joinGame(gameId: string, playerName: string, playerMode: PlayerMode): void {
    const game = this._game();

    if (!game) {
      console.warn('No existe una partida activa.');
      return;
    }

    if (game.id !== gameId) {
      console.warn('El gameId del link no coincide con la partida activa.');
      return;
    }

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: capitalizeName(playerName),
      role: 'player',
      mode: playerMode,
      selectedCard: null
    };

    this.persist({
      ...game,
      players: [...game.players, newPlayer],
      status: 'voting'
    });

    this.saveCurrentPlayer(newPlayer.id);
  }

  updatePlayerVote(playerId: string, card: Card): void {
    const game = this._game();
    if (!game || game.status !== 'voting') return;

    this.persist({
      ...game,
      players: game.players.map(p =>
        p.id === playerId && p.mode === 'player'
          ? { ...p, selectedCard: card }
          : p
      )
    });
  }

  revealCards(): void {
    const game = this._game();
    if (!game || !this.isCurrentUserAdmin()) return;

    this.persist({ ...game, status: 'counting' });

    setTimeout(() => {
      const current = this._game();
      if (!current || current.status !== 'counting') return;
      this.persist({ ...current, status: 'revealed' });
    }, 1500);
  }

  resetGame(): void {
    const game = this._game();
    if (!game || !this.isCurrentUserAdmin()) return;

    this.persist({
      ...game,
      players: game.players.map(p => ({ ...p, selectedCard: null })),
      status: 'voting'
    });
  }

  // Cambia el modo de puntaje y resetea votos
  setCardMode(modeId: string): void {
    const game = this._game();
    if (!game || !this.isCurrentUserAdmin()) return;
    if (game.status === 'revealed') return;

    const mode = CARD_MODES.find(m => m.id === modeId);
    if (!mode) return;

    this.persist({
      ...game,
      players: game.players.map(p => ({ ...p, selectedCard: null })),
      status: 'voting'
    });

    this._currentCardModeId.set(modeId);
    this._cards.set(createCards(mode.values));
  }

  // Promueve un jugador a admin
  promoteToAdmin(playerId: string): void {
    const game = this._game();
    if (!game || !this.isCurrentUserAdmin()) return;

    this.persist({
      ...game,
      players: game.players.map(p =>
        p.id === playerId ? { ...p, role: 'admin' as const } : p
      )
    });
  }

  // Cambia el modo de visualización del jugador y resetea su voto
  updatePlayerMode(playerId: string, mode: PlayerMode): void {
    const game = this._game();
    if (!game) return;

    this.persist({
      ...game,
      players: game.players.map(p =>
        p.id === playerId ? { ...p, mode, selectedCard: null } : p
      )
    });
  }

  // Acciones de sesión

  private saveCurrentPlayer(playerId: string): void {
    this._currentPlayerId.set(playerId);
    sessionStorage.setItem(this.PLAYER_KEY, playerId);
  }

  clearCurrentPlayer(): void {
    this._currentPlayerId.set(null);
    sessionStorage.removeItem(this.PLAYER_KEY);
  }
}