// This is the interface of our response data fron /user/:id route
export interface UserData {
    userID: string;
    platforms: String[];
    totalSpent: number;
    gamesData: GamesData[];
}

export interface GamesData extends Game {
    spent: number;
}

// Shared interface for all routes, we export it here and use it everywhere
export interface Game {
    gameID: number;
    title: string;
}
