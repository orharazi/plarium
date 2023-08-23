import express, { Request, Response } from 'express';
import PlatformsController from '../controllers/platforms.controller';
import { PlatformData } from '../models/platforms.model';

const platformsController = new PlatformsController();
const platformsRouter = express.Router();

platformsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const platforms: PlatformData[] | null =
            await platformsController.obtainPlatformsInfo();
        res.json(platforms);
    } catch (_error) {
        const error = _error as Error;
        throw Error(
            `Error while GET /platforms: ${error.name}: ${error.message}`
        );
    }
});

export default platformsRouter;
