import { APIResponse, UserData } from '../models/user.model';
import datasetService from '../services/dataset.service';

class UserController {
    // Function that called to service that interact with the DB in order to get data
    obtainUserInfo(userId: string): Promise<APIResponse> {
        return datasetService.getUserData(userId);
    }
}

export default UserController;
