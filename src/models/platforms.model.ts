import { Game } from './dataset.model';

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
