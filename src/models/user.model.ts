import { Game } from './dataset.model';

export interface UserData {
    userID: string;
    platforms: String[];
    totalSpent: number;
    gamesData: GamesData[];
}

export interface GamesData extends Game {
    spent: number;
}
