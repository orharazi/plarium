import { PlatformData } from '../models/platforms.model';
import datasetService from '../services/dataset.service';

class PlatformsController {
    // Function that called to service that interact with the DB in order to get data
    obtainPlatformsInfo(): Promise<PlatformData[]> {
        return datasetService.getPlatformsData();
    }
}

export default PlatformsController;
