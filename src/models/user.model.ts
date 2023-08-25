// This is the interface of our response data fron /user/:id route
export interface UserData {
    userID: string;
    platforms: userPlatforms[];
    totalSpent: number; // Total amount of money user spent on games in all platforms
    gamesData: GamesData[];
    totalActions: number; // The number of actions that the user did
    activePlayer: boolean; // If the user had more register action then unregister action - he active.
}

export interface GamesData extends Game {
    spent: number; // How much money user spent on each game
    platforms: userPlatforms[];
    activePlayer: boolean; // If the user had more register action then unregister action in this game - he active.
}

export interface userPlatforms {
    platform: string; // Platform name
    totalActions: number; // Number of action in this game using this platform
    spent: number; // Amount of money user spent on this plafform in this game
}

/* Shared interface for all routes, we export it here and use it everywhere */
export interface Game {
    gameID: number;
    title: string; // Name of game
}

export interface Action {
    gameID: number;
    title: string;
    platform: string;
    userID: String;
    action: string;
    price?: number;
}
