import s3Service from "./s3-part-upload.js";
import storageService from "./storage-service.js";



const serviceStorage = {
    storageService,
    s3Service
}

export default  serviceStorage;