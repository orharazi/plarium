// exampleService.ts
import { PlatformData } from '../models/platforms.model';
import {
    Action,
    GamesData,
    UserData,
    userPlatforms,
} from '../models/user.model';
import knex from '../DB/knexConfig';

class DatasetService {
    private knex;
    constructor(knex: any) {
        this.knex = knex;
    }
    async getUserData(userId: string): Promise<UserData | null> {
        try {
            const userActions: Action[] = await this.knex
                .select(
                    'action',
                    'gameid AS gameID',
                    'platform',
                    'price',
                    'title',
                    'userid AS userID'
                )
                .from('events.game_actions')
                .where('userid', userId);

            if (userActions.length > 0) {
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
            const subquery = this.knex
                .select([
                    'platform',
                    'gameid AS gameID',
                    'title',
                    this.knex.countDistinct('userid').as('totalPlayers'),
                    this.knex.sum('price').as('earns'),
                    this.knex
                        .sum(
                            this.knex.raw(
                                "CASE WHEN action = 'register' THEN 1 ELSE 0 END"
                            )
                        )
                        .as('registeredPlayers'),
                    this.knex
                        .sum(
                            this.knex.raw(
                                "CASE WHEN action = 'unregister' THEN 1 ELSE 0 END"
                            )
                        )
                        .as('unregisteredPlayers'),
                ])
                .from('events.game_actions')
                .groupBy('platform', 'gameID', 'title')
                .as('GameAggregates');

            const platformData: PlatformData[] = await this.knex
                .select([
                    'platform',
                    this.knex.sum('totalPlayers').as('totalPlayers'),
                    this.knex.sum('earns').as('totalEarns'),
                    this.knex.raw(`
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                            'gameID', "gameID",
                            'title', title,
                            'totalPlayers', "totalPlayers",
                            'earns', earns,
                            'activePlayers', "registeredPlayers" - "unregisteredPlayers"
                            )
                        ) AS games
                    `),
                    this.knex
                        .sum(
                            this.knex.raw(
                                '"registeredPlayers" - "unregisteredPlayers"'
                            )
                        )
                        .as('activePlayers'),
                ])
                .from(subquery)
                .groupBy('platform')
                .orderBy('platform');

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

export default new DatasetService(knex);
