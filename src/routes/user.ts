import express, { Express, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import { APIResponse, UserData } from '../models/user.model';

const userController = new UserController();
const userRouter = express.Router();

userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const userId: string | undefined = String(req.params.id);
        console.log(`GET /user/${userId} ${new Date()}`);
        if (userId) {
            // This function should return as our relevant data from out DB and manipulate it
            const userInfo: APIResponse = await userController.obtainUserInfo(
                userId
            );
            if (userInfo.success) {
                res.status(200).json(userInfo.data);
            } else {
                res.status(400).send('Could not getting data, check console.');
            }
        } else {
            const msg = `User id is undefined. Provide valid user id, example: http://localhost:3000/user/:userId`;
            console.log(msg);
            res.status(400).send(msg);
        }
    } catch (_error) {
        const error = _error as Error;
        const msg = `Error while GET /user/:userId: ${error.name}: ${error.message}`;
        console.error(msg);
        res.status(500).json({ error: msg });
    }
});

export default userRouter;
