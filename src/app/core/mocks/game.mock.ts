import { Game, Player } from '../models/game.model';

export const MOCK_ADMIN_PLAYER: Player = {
    id: 'p1',
    name: 'Luisa',
    role: 'admin',
    mode: 'player',
    selectedCard: null
};

export const MOCK_PLAYER: Player = {
    id: 'p2',
    name: 'Oscar',
    role: 'player',
    mode: 'player',
    selectedCard: null
};

export const MOCK_SPECTATOR_PLAYER: Player = {
    id: 'p3',
    name: 'Valen',
    role: 'player',
    mode: 'spectator',
    selectedCard: null
};

export const MOCK_PLAYERS: Player[] = [
    MOCK_ADMIN_PLAYER,
    MOCK_PLAYER,
    MOCK_SPECTATOR_PLAYER
];

export const MOCK_GAME: Game = {
    id: 'game-001',
    name: 'Sprint 32',
    status: 'waiting',
    inviteLink: 'https://planning-poker.com/game/game-001',
    players: MOCK_PLAYERS
};