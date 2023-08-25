// exampleService.ts
import { PlatformData } from '../models/platforms.model';
import {
    Action,
    GamesData,
    UserData,
    userPlatforms,
} from '../models/user.model';
import DB from '../DB/db';
import { QueryResult } from 'pg';

class DatasetService {
    async getUserData(userId: string): Promise<UserData | null> {
        try {
            const query = `
            SELECT 
                action, gameid AS "gameID", platform, price, title, userid as "userID" 
            FROM 
                events.game_actions 
            WHERE 
                userid = '${userId}'`;
            const result: QueryResult<Action> = await DB.query(query);

            if (result.rows.length > 0) {
                const userActions = result.rows;
                const platforms: userPlatforms[] = [];
                const gamesData: GamesData[] = [];

                // Here we run on all user actions and obtain relevate data
                for (let i = 0; i < userActions.length; i++) {
                    const actionData = userActions[i];

                    // Trying to find the game from gamesData
                    const game = gamesData.find(
                        (_) => _.gameID === actionData.gameID
                    );
                    if (game) {
                        // Increase the amount of spent in the game
                        game.spent += +(actionData.price || 0);

                        // Locate the platform from user -> games -> platform
                        const gamePlatform = game.platforms.find(
                            (_) => _.platform === actionData.platform
                        );
                        if (gamePlatform) {
                            // Increase the amount of total action in the game
                            gamePlatform.totalActions++;

                            // Increase the amount of spent in the game
                            gamePlatform.spent += +(actionData.price || 0);
                        } else {
                            // Add the platform to game platforms
                            game.platforms = [
                                ...game.platforms,
                                {
                                    platform: actionData.platform,
                                    totalActions: 1, // number of action in this game
                                    spent: actionData.price || 0,
                                },
                            ];
                        }
                    } else {
                        // Add game to the gamesData array
                        gamesData.push({
                            gameID: actionData.gameID,
                            title: actionData.title,
                            spent: actionData.price || 0,
                            platforms: [
                                {
                                    platform: actionData.platform,
                                    totalActions: 1,
                                    spent: actionData.price || 0,
                                },
                            ],
                            activePlayer:
                                userActions
                                    .filter(
                                        (action) =>
                                            action.gameID === actionData.gameID
                                    )
                                    .reduce((count, obj) => {
                                        if (obj.action === 'register')
                                            count += 1;

                                        if (obj.action === 'unregister')
                                            count -= 1;

                                        return count;
                                    }, 0) > 0,
                        });
                    }

                    // Trying to find platform from platforms
                    const platform = platforms.find(
                        (_) => _.platform === actionData.platform
                    );
                    if (platform) {
                        // Increase the amount of total action in the game
                        platform.totalActions++;

                        // Increase the amount of spent in the game
                        platform.spent += +(actionData.price || 0);
                    } else {
                        platforms.push({
                            platform: actionData.platform,
                            totalActions: 1,
                            spent: actionData.price || 0,
                        });
                    }
                }

                const userData: UserData = {
                    userID: userId,
                    platforms,
                    totalSpent: gamesData.reduce(
                        (acc, gameData) => acc + gameData.spent,
                        0
                    ),
                    gamesData,
                    totalActions: userActions.length,
                    activePlayer: gamesData.some((game) => game.activePlayer),
                };
                return userData;
            } else {
                console.error(`Cannot find user with id of: ${userId}`);
                return null;
            }
        } catch (_error) {
            const error = _error as Error;
            console.error(
                `Error while getUserData(): ${error.name}: ${error.message}`
            );
            return null;
        }
    }
    async getPlatformsData(): Promise<PlatformData[]> {
        try {
            const query = `
SELECT 
    platform,
    SUM(totalPlayers) AS "totalPlayers",
    SUM(earns) AS "totalEarns",
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'gameID', gameID,
            'title', title,
            'totalPlayers', totalPlayers,
            'earns', earns,
            'activePlayers', activePlayers
        )
    ) AS games,
    SUM(activePlayers) AS "activePlayers"
FROM (
    SELECT
        platform,
        gameID,
        title,
        COUNT(DISTINCT userID) AS totalPlayers,
        SUM(price) AS earns,
        COUNT(DISTINCT CASE WHEN action = 'register' THEN userID END) -
        COUNT(DISTINCT CASE WHEN action = 'unregister' THEN userID END) AS activePlayers
    FROM
        events.game_actions
    GROUP BY
        platform, gameID, title
) AS GameAggregates
GROUP BY
    platform
ORDER BY
    platform;

        `;
            const result: QueryResult<PlatformData> = await DB.query(query);
            const platformData: PlatformData[] = result.rows;
            if (platformData.length > 0) {
                return platformData;
            } else {
                throw Error('Cannot get game actions');
            }
        } catch (_error) {
            const error = _error as Error;
            console.error(
                `Error while getPlatformsData(): ${error.name}: ${error.message}`
            );
            return [];
        }
    }
}

export default new DatasetService();
