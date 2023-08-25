import Server from '../app';
import request from 'supertest';
import { describe } from 'mocha';
import { expect } from 'chai';
import { PlatformData } from '../models/platforms.model';

const server = new Server();

describe('GET User Route', () => {
    before(async () => {
        await server.start(); // Start the server before running tests
    });

    after(async () => {
        server.close(); // Close the server after tests
    });
    it('should get information about user', async () => {
        const response = await request(server.appListener).get(
            '/user/0822acd7-81fb-4160-80af-8e1211392ed6'
        );
        const returnedData = JSON.stringify(response.body);

        expect(response.status).to.equal(200);
        expect(returnedData).to.equals(JSON.stringify(expectedUserData));
    }).timeout(5000);
});

const expectedUserData = {
    userID: '0822acd7-81fb-4160-80af-8e1211392ed6',
    platforms: [
        {
            platform: 'ios',
            totalActions: 7,
            spent: 0.77,
        },
        {
            platform: 'android',
            totalActions: 3,
            spent: 0,
        },
        {
            platform: 'desktop',
            totalActions: 3,
            spent: 0.22,
        },
        {
            platform: 'web',
            totalActions: 1,
            spent: 0,
        },
    ],
    totalSpent: 0.99,
    gamesData: [
        {
            title: 'Throne',
            spent: 0.99,
            platforms: [
                {
                    platform: 'ios',
                    totalActions: 7,
                    spent: 0.77,
                },
                {
                    platform: 'android',
                    totalActions: 3,
                    spent: 0,
                },
                {
                    platform: 'desktop',
                    totalActions: 3,
                    spent: 0.22,
                },
                {
                    platform: 'web',
                    totalActions: 1,
                    spent: 0,
                },
            ],
            activePlayer: true,
        },
    ],
    totalActions: 14,
    activePlayer: true,
};
