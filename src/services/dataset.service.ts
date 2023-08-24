// exampleService.ts
import { PlatformData } from '../models/platforms.model';
import { GamesData, UserData } from '../models/user.model';
import DB from '../DB/db';
import { QueryResult } from 'pg';

class DatasetService {
    async getUserData(userId: string): Promise<UserData | null> {
        try {
            const query = `
            WITH UserPlatformSpending AS (
                SELECT
                    userID,
                    platform,
                    gameID,
                    COALESCE(SUM(price), 0) AS totalSpent
                FROM
                    events.game_actions
                WHERE
                    userID = '${userId}'
                GROUP BY
                    userID,
                    platform,
                    gameID
            ),
            UserGames AS (
                SELECT DISTINCT
                    gameID,
                    title
                FROM
                    events.game_actions
                WHERE
                    userID = '${userId}'
            ),
            GamesSpending AS (
                SELECT
                    UserGames.gameID,
                    UserGames.title,
                    UserPlatformSpending.platform,
                    UserPlatformSpending.totalSpent AS spent
                FROM
                    UserGames
                LEFT JOIN
                    UserPlatformSpending ON UserGames.gameID = UserPlatformSpending.gameID
            )
            SELECT
                '${userId}' AS "userID",
                array_agg(DISTINCT UserPlatformSpending.platform) AS platforms,
                COALESCE(SUM(totalSpent), 0) AS "totalSpent",
                json_agg(json_build_object('gameID', UserPlatformSpending.gameID, 'title', title, 'spent', spent)) AS "gamesData"
            FROM
                UserPlatformSpending
            LEFT JOIN GamesSpending ON UserPlatformSpending.platform = GamesSpending.platform
            GROUP BY
                userID;
`;
            const result: QueryResult<UserData> = await DB.query(query);
            if (result.rows[0]) {
                const gamesData: GamesData[] = [];
                result.rows[0].gamesData.forEach((action) => {
                    const game = gamesData.find(
                        (_) => _.gameID === action.gameID
                    );
                    if (game) {
                        game.spent += action.spent;
                    } else {
                        gamesData.push(action);
                    }
                });

                const userData: UserData = {
                    userID: result.rows[0].userID,
                    platforms: result.rows[0].platforms,
                    totalSpent: result.rows[0].totalSpent,
                    gamesData,
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
                SUM(players) AS "totalPlayers",
                SUM(earns) AS "totalEarns",
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'gameID', gameID,
                        'title', title,
                        'players', players,
                        'earns', earns
                    )
                ) AS games
            FROM (
                SELECT
                    platform,
                    gameID,
                    title,
                    COUNT(DISTINCT userID) AS players,
                    SUM(price) AS earns
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
            const platformData: PlatformData[] = result.rows.map((row) => {
                return {
                    platform: row.platform,
                    totalPlayers: row.totalPlayers,
                    totalEarns: row.totalEarns,
                    games: row.games,
                };
            });
            return platformData || [];
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
