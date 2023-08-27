import express, { Request, Response } from 'express';
import PlatformsController from '../controllers/platforms.controller';
import { PlatformData } from '../models/platforms.model';
import { APIResponse } from '../models/user.model';

const platformsController = new PlatformsController();
const platformsRouter = express.Router();

platformsRouter.get('/', async (req: Request, res: Response) => {
    console.log(`GET /platforms ${new Date()}`);
    try {
        // This function should return as our relevant data from out DB and manipulate it
        const platformsData: APIResponse =
            await platformsController.obtainPlatformsInfo();

        if (platformsData.success) {
            res.status(200).json(platformsData.data);
        } else {
            res.status(400).send('Could not getting data, check console.');
        }
    } catch (_error) {
        const error = _error as Error;
        const msg = `Error while GET /platforms: ${error.name}: ${error.message}`;
        console.error(msg);
        res.status(500).json({ error: msg });
    }
});

export default platformsRouter;
