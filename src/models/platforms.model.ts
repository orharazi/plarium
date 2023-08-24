import { Game } from './user.model';

// This is the interface of our response data fron /platforms route
export interface PlatformData {
    platform: string;
    totalPlayers: number;
    totalEarns: number;
    games: playersPerGame[];
}

export interface playersPerGame extends Game {
    players: number;
    earns: number;
}
