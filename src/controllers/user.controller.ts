import { UserData } from '../models/user.model';
import datasetService from '../services/dataset.service';

class UserController {
    obtainUserInfo(userId: string): Promise<UserData | null> {
        return datasetService.getUserData(userId);
    }
}

export default UserController;
