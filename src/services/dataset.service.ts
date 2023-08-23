// exampleService.ts
import EventsModel, { Event } from '../models/dataset.model';
import { PlatformData, playersPerGame } from '../models/platforms.model';
import { GamesData, UserData } from '../models/user.model';
import { Types } from 'mongoose';

class DatasetService {
    async getUserData(userId: string): Promise<UserData | null> {
        try {
            const userActions: Event[] = await EventsModel.find({
                userID: userId,
            });
            const platforms = [...new Set(userActions.map((_) => _.platform))];
            const gamesMap = new Map<number, GamesData>();

            userActions.forEach((event) => {
                if (!gamesMap.has(event.gameID)) {
                    gamesMap.set(event.gameID, {
                        gameID: event.gameID,
                        title: event.title,
                        spent: event.price || 0,
                    });
                } else {
                    const existingGameData = gamesMap.get(event.gameID);
                    if (event.price && existingGameData) {
                        existingGameData.spent += event.price;
                    }
                }
            });

            const gamesData: GamesData[] = Array.from(gamesMap.values());
            const totalSpent = gamesData.reduce(
                (acc, gameData) => acc + gameData.spent,
                0
            );
            const userData: UserData = {
                userID: userId,
                platforms,
                totalSpent,
                gamesData,
            };
            if (userData) return userData;
            return null;
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
            // Define and execute the aggregation pipeline
            const DBData = await EventsModel.aggregate(
                [
                    {
                        $group: {
                            _id: {
                                platform: '$platform',
                                gameID: '$gameID',
                            },
                            totalPlayers: {
                                $sum: 1,
                            },
                            totalEarns: {
                                $sum: '$price',
                            },
                            games: {
                                $push: {
                                    title: '$title',
                                    players: 1,
                                    earns: '$price',
                                },
                            },
                        },
                    },
                    {
                        $group: {
                            _id: '$_id.platform',
                            platform: {
                                $first: '$_id.platform',
                            },
                            games: {
                                $push: {
                                    gameID: '$_id.gameID',
                                    title: {
                                        $first: '$games.title',
                                    },
                                    players: {
                                        $sum: '$games.players',
                                    },
                                    earns: {
                                        $sum: '$games.earns',
                                    },
                                },
                            },
                            totalPlayers: {
                                $sum: '$totalPlayers',
                            },
                            totalEarns: {
                                $sum: '$totalEarns',
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            platform: 1,
                            games: 1,
                            totalPlayers: 1,
                            totalEarns: 1,
                        },
                    },
                ],
                { allowDiskUse: true }
            );

            console.log(DBData);

            return DBData;
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
