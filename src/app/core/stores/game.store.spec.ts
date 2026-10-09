import { TestBed } from '@angular/core/testing';
import { GameStore } from './game.store';
import { Game } from '../models/game.model';
import { MOCK_GAME, MOCK_ADMIN_PLAYER, MOCK_PLAYER } from '../mocks/game.mock';

const GAME_KEY = 'planning_poker_game';
const PROFILE_KEY = 'planning_poker_profile';
const PLAYER_KEY = 'planning_poker_player_id';

describe('GameStore', () => {

  function clearStorage(): void {
    localStorage.removeItem(GAME_KEY);
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(PLAYER_KEY);
  }

  // El store lee el storage en el constructor: hay que sembrarlo antes de inyectar
  function seedGame(game: Game, currentPlayerId?: string): void {
    localStorage.setItem(GAME_KEY, JSON.stringify(game));
    if (currentPlayerId) sessionStorage.setItem(PLAYER_KEY, currentPlayerId);
  }

  beforeEach(() => {
    clearStorage();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    clearStorage();
  });

  describe('saved profile', () => {

    it('should have no saved profile by default', () => {
      const store = TestBed.inject(GameStore);
      expect(store.savedProfile()).toBeNull();
    });

    it('should save profile when admin player is created', () => {
      const store = TestBed.inject(GameStore);
      store.createGame('Sprint 32');
      store.addAdminPlayer('luisa', 'spectator');

      expect(store.savedProfile()).toEqual({ name: 'Luisa', mode: 'spectator' });
      expect(JSON.parse(localStorage.getItem(PROFILE_KEY)!)).toEqual({ name: 'Luisa', mode: 'spectator' });
    });

    it('should save profile when a player joins', () => {
      seedGame(MOCK_GAME);
      const store = TestBed.inject(GameStore);
      store.joinGame(MOCK_GAME.id, 'carla', 'player');

      expect(store.savedProfile()).toEqual({ name: 'Carla', mode: 'player' });
      expect(JSON.parse(localStorage.getItem(PROFILE_KEY)!)).toEqual({ name: 'Carla', mode: 'player' });
    });

    it('should restore profile from localStorage', () => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: 'Mateo', mode: 'spectator' }));
      const store = TestBed.inject(GameStore);

      expect(store.savedProfile()).toEqual({ name: 'Mateo', mode: 'spectator' });
    });

    it('should ignore corrupt profile JSON', () => {
      localStorage.setItem(PROFILE_KEY, '{not valid json');
      const store = TestBed.inject(GameStore);

      expect(store.savedProfile()).toBeNull();
    });

    it('should ignore a profile without a string name', () => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: 42, mode: 'player' }));
      const store = TestBed.inject(GameStore);

      expect(store.savedProfile()).toBeNull();
    });

    it('should update saved mode when current player changes mode', () => {
      const store = TestBed.inject(GameStore);
      store.createGame('Sprint 32');
      store.addAdminPlayer('Luisa', 'player');

      store.updatePlayerMode(store.currentPlayer()!.id, 'spectator');

      expect(store.savedProfile()).toEqual({ name: 'Luisa', mode: 'spectator' });
    });

    it('should not update saved profile when another player changes mode', () => {
      seedGame(MOCK_GAME, MOCK_ADMIN_PLAYER.id);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: 'Luisa', mode: 'player' }));
      const store = TestBed.inject(GameStore);

      store.updatePlayerMode(MOCK_PLAYER.id, 'spectator');

      expect(store.savedProfile()).toEqual({ name: 'Luisa', mode: 'player' });
    });
  });

  describe('leaveGame', () => {

    it('should remove the current player and clear the current player', () => {
      seedGame(MOCK_GAME, MOCK_PLAYER.id);
      const store = TestBed.inject(GameStore);

      store.leaveGame();

      expect(store.players().some(p => p.id === MOCK_PLAYER.id)).toBe(false);
      expect(store.players().length).toBe(MOCK_GAME.players.length - 1);
      expect(store.currentPlayer()).toBeNull();
      expect(sessionStorage.getItem(PLAYER_KEY)).toBeNull();
    });

    it('should persist the game without the player', () => {
      seedGame(MOCK_GAME, MOCK_PLAYER.id);
      const store = TestBed.inject(GameStore);

      store.leaveGame();

      const stored: Game = JSON.parse(localStorage.getItem(GAME_KEY)!);
      expect(stored.players.map(p => p.id)).not.toContain(MOCK_PLAYER.id);
    });

    it('should keep the saved profile after leaving', () => {
      const store = TestBed.inject(GameStore);
      store.createGame('Sprint 32');
      store.addAdminPlayer('Luisa', 'player');

      store.leaveGame();

      expect(store.savedProfile()).toEqual({ name: 'Luisa', mode: 'player' });
    });

    it('should promote the next player when the only admin leaves', () => {
      seedGame(MOCK_GAME, MOCK_ADMIN_PLAYER.id);
      const store = TestBed.inject(GameStore);

      store.leaveGame();

      const players = store.players();
      expect(players[0].id).toBe(MOCK_PLAYER.id);
      expect(players[0].role).toBe('admin');
      expect(players.filter(p => p.role === 'admin').length).toBe(1);
    });

    it('should not change roles when a non-admin leaves', () => {
      seedGame(MOCK_GAME, MOCK_PLAYER.id);
      const store = TestBed.inject(GameStore);

      store.leaveGame();

      const admins = store.players().filter(p => p.role === 'admin');
      expect(admins.map(p => p.id)).toEqual([MOCK_ADMIN_PLAYER.id]);
    });

    it('should leave the game empty and waiting when the last player leaves', () => {
      const store = TestBed.inject(GameStore);
      store.createGame('Sprint 32');
      store.addAdminPlayer('Luisa', 'player');
      expect(store.status()).toBe('voting');

      store.leaveGame();

      expect(store.players()).toEqual([]);
      expect(store.status()).toBe('waiting');
      expect(store.game()).not.toBeNull();
    });

    it('should do nothing when there is no current player', () => {
      seedGame(MOCK_GAME);
      const store = TestBed.inject(GameStore);

      store.leaveGame();

      expect(store.game()).toEqual(MOCK_GAME);
    });
  });

  describe('joinGame', () => {

    it('should assign admin role when the game has no admin', () => {
      const store = TestBed.inject(GameStore);
      store.createGame('Sprint 32');
      store.addAdminPlayer('Luisa', 'player');
      store.leaveGame();

      store.joinGame(store.game()!.id, 'Carla', 'player');

      expect(store.currentPlayer()?.role).toBe('admin');
    });

    it('should assign player role when the game already has an admin', () => {
      seedGame(MOCK_GAME);
      const store = TestBed.inject(GameStore);

      store.joinGame(MOCK_GAME.id, 'Carla', 'player');

      expect(store.currentPlayer()?.role).toBe('player');
      expect(store.players().length).toBe(MOCK_GAME.players.length + 1);
    });
  });
});
