import { Game } from './user.model';

// This is the interface of our response data fron /platforms route
export interface PlatformData {
    platform: string;
    totalPlayers: number;
    totalEarns: number;
    games: playersPerGame[];
    activePlayers: number;
}

export interface playersPerGame extends Game {
    activePlayers: number;
    totalPlayers: number;
    earns: number;
}
