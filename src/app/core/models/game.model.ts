export interface Game {
  id: string;
  name: string;
  players: Player[];
  status: GameStatus;
  inviteLink: string;
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  mode: PlayerMode;
  selectedCard: Card | null;
}

// Perfil recordado en el navegador para prellenar el formulario
export interface UserProfile {
  name: string;
  mode: PlayerMode;
}

export interface Card {
  id: string;
  value: string | number;
}

export type GameStatus = 'waiting' | 'voting' | 'counting' | 'revealed';
export type PlayerRole = 'admin' | 'player';
export type PlayerMode = 'player' | 'spectator';