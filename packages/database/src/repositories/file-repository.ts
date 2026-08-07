import { Op, type Transaction } from 'sequelize';

import model from '../models/index.js';

import type { IFileProcessingCreateAttributes } from '../types/file-processing-type.js';
import type { IFileCreationAttributes } from '../types/file-type.js';


/**
 * 
 * @param file accepts file information
 * @param transaction accepts transaction object
 * @returns success after creating files
 */


const createFile = (file: IFileCreationAttributes) => {
  return model.File.create(file);
};

/**
 * 
 * @param file accepts file information
 * @param transaction accepts transaction object
 * @returns success after creating files for processing
 */


const createFIleProcessing = (file: IFileProcessingCreateAttributes) => {
  return model.FileProcessing.create(file);
};


/**
 * 
 * @param fileId accepts fileId 
 * @param path accepts file path
 * @param transaction accepts transction
 * 
 */
const updateFilePath = (fileId: number, path: string) =>
  model.File.update(
    { path: path },
    {
      where: {
        id: fileId,
      },
    },
  );

  /**
   * 
   * @param fileId accepts fileId 
   * @returns JSON containing  file details
   */

const findFileByPrimaryKey = (fileId: number) => {
  return model.File.findByPk(fileId);
};


  /**
   * 
   * @param fileId accepts fileId 
   * @returns JSON containing  file details
   */

  const findOwnerShipFiles = (userId: number) => {
    return model.File.findOne({

      where:{
        user_id:userId
      }
    });
  };
  /**
   * 
   * @param fileId accepts fileId 
   * @param thumbnailImage accepts thumbnail image
   * @returns JSON containing  update file count
   */

const updateFileThumbnailImage = (fileId: number, thumbnailImage: string) => {
  return model.File.update(
    { thumbnail_image: thumbnailImage },
    {
      where: {
        id: fileId,
      },
    },
  );
};





  /**
   * 
   * @param fileId accepts fileId 
   * @param status accepts status
   * @params transaction accepts transaction types
   * updates file status
   */

const updateFileStatus = (fileId: number, status: string) =>
  model.File.update(
    { status: status },
    {
      where: {
        id: fileId,
      }
    },
  );


   /**
   * 
   * @param processingId accepts file 
   * @param status accepts status
   * 
   * updates file processing status
   */

const updateFileProcessingStatus = (processingId: number, status: string) =>
  model.FileProcessing.update(
    { status: status },
    {
      where: {
        id: processingId,
      },
    },
  );

  /**
   * 
   * @param files accepts file attribute and create files
   * @returns created file details
   */

const bulkCreate = (files: IFileCreationAttributes[]) => {
  return model.File.bulkCreate(files);
};

  /**
   * 
   * @param userId accept userId 
   * @param type  accept file Type 
   * @returns file Count
   */

const countFiles = (userId: number, type: string) => {
  return model.File.count({
    where: {
      user_id: userId,
      type: type
    },
  });
};


/**
 * 
 * @param userId accepts userId 
 * @param type  accepts file Type
 * @param page  accepts page count
 * @param limit accepts page limit
 * @returns JSON containing paginated result
 */


const findAllByType = (
  userId: number,
  type: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  return model.File.findAndCountAll({
    where: {
      user_id: userId,
      type,
    },
    limit,
    offset,
    order: [['uploadedAt', 'DESC']],
  });
};

/**
 * 
 * @param processingId accepts processing ID
 * @returns upload Id of MinIO
 */

const findUploadId = (processingId: number) => {
  return model.FileProcessing.findOne({
    where: {
      id: processingId,
    },
  });
};

/**
 * 
 * @param userId accepts user ID
 * @returns fileCounts by user details
 */

const getFileCounts = async (userId: number) => {
  const [images, videos, others] = await Promise.all([
    model.File.count({
      where: {
        user_id: userId,
        mime_type: {
          [Op.like]: 'image/%',
        },
      },
    }),

    model.File.count({
      where: {
        user_id: userId,
        mime_type: {
          [Op.like]: 'video/%',
        },
      },
    }),

    model.File.count({
      where: {
        user_id: userId,
        [Op.and]: [
          {
            mime_type: {
              [Op.notLike]: 'image/%',
            },
          },
          {
            mime_type: {
              [Op.notLike]: 'video/%',
            },
          },
        ],
      },
    }),
  ]);

  return {
    images,
    videos,
    others,
  };
};



const fileRepository = {
  createFile,
  createFIleProcessing,
  updateFilePath,
  updateFileStatus,
  updateFileProcessingStatus,
  bulkCreate,
  countFiles,
  findAllByType,
  updateFileThumbnailImage,
  findUploadId,
  getFileCounts,
  findOwnerShipFiles,
  findFileByPrimaryKey,
};

export default fileRepository;
