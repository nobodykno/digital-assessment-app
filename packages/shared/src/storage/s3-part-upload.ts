import { CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { IInitMultipartUpload, IUploadPart, ICompleteMultipartUpload, IAbortMultipartUpload } from "./s3-client-dto.js";
import s3Client from "./s3.js";

const initMultipartUpload = async ({
    bucket,
    key,
    contentType,
  }: IInitMultipartUpload): Promise<string> => {
    const response = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      }),
    );
  
    if (!response.UploadId) {
      throw new Error("Failed to initialize multipart upload.");
    }
  
    return response.UploadId;
  };
  
  /**
   * Uploads a single part.
   */
  const uploadPart = async ({
    bucket,
    key,
    uploadId,
    partNumber,
    body,
  }: IUploadPart): Promise<string> => {
    const response = await s3Client.send(
      new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: body,
      }),
    );
  
    if (!response.ETag) {
      throw new Error(`Failed to upload part ${partNumber}.`);
    }
  
    return response.ETag;
  };
  
  /**
   * Completes multipart upload.
   */
  const completeMultipartUpload = async ({
    bucket,
    key,
    uploadId,
    parts,
  }: ICompleteMultipartUpload): Promise<void> => {
    await s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      }),
    );
  };
  
  /**
   * Aborts multipart upload.
   */
  const abortMultipartUpload = async ({
    bucket,
    key,
    uploadId,
  }: IAbortMultipartUpload): Promise<void> => {
    await s3Client.send(
      new AbortMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
      }),
    );
  };
  

  const s3Service = {
    abortMultipartUpload,
    uploadPart,
    initMultipartUpload,
    completeMultipartUpload,
  }

  export default s3Service;