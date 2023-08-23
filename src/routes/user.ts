import express, { Express, Request, Response } from 'express';
import UserController from '../controllers/user.controller';

const userController = new UserController();
const userRouter = express.Router();

userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const userId: string | undefined = String(req.params.id);
        if (userId) {
            const userInfo = await userController.obtainUserInfo(userId);
            res.json(userInfo);
        } else {
        }
    } catch (_error) {
        const error = _error as Error;
        throw Error(`Error while GET /user: ${error.name}: ${error.message}`);
    }
});

export default userRouter;
