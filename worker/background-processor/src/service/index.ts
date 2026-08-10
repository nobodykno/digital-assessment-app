import imageService
from "./thumbnail-service.js";

import videoThumbnailService
 from "./video-thumbnail-service.js";
const workerService = {
    imageService,
    videoThumbnailService
}

export default workerService;