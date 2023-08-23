import { PlatformData } from '../models/platforms.model';
import datasetService from '../services/dataset.service';

class PlatformsController {
    obtainPlatformsInfo(): Promise<PlatformData[]> {
        return datasetService.getPlatformsData();
    }
}

export default PlatformsController;
