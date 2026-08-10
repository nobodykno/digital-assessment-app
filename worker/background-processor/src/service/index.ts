import imageService
from "./thumbnail-service.js";
import videoQualityService from "./video-quality-service.js";

import videoThumbnailService
 from "./video-thumbnail-service.js";
const workerService = {
    imageService,
    videoThumbnailService,
    videoQualityService
}

export default workerService;