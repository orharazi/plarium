import { PlatformData } from '../models/platforms.model';
import { APIResponse } from '../models/user.model';
import datasetService from '../services/dataset.service';

class PlatformsController {
    // Function that called to service that interact with the DB in order to get data
    obtainPlatformsInfo(): Promise<APIResponse> {
        return datasetService.getPlatformsData();
    }
}

export default PlatformsController;
