import Server from '../app';
import request from 'supertest';
import { describe } from 'mocha';
import { expect } from 'chai';
import { PlatformData } from '../models/platforms.model';
import dotenv from 'dotenv';

const server = new Server();
dotenv.config();

describe('GET Platform Route', () => {
    before(async () => {
        await server.start(); // Start the server before running tests
    });

    after(async () => {
        server.close(); // Close the server after tests
    });

    it('should get information about all platforms', async () => {
        const response = await request(server.appListener).get('/platforms');
        const returnedData: PlatformData[] = response.body;

        expect(response.status).to.equal(200);
        expect(
            containsAllStrings(
                returnedData.map((platformData) => platformData.platform),
                ['ios', 'android', 'desktop', 'web']
            )
        ).to.be.true;
    }).timeout(5000);
});

function containsAllStrings(actual: string[], expectedList: string[]) {
    for (const expectedString of expectedList) {
        if (!actual.includes(expectedString)) {
            return false;
        }
    }
    return true;
}
