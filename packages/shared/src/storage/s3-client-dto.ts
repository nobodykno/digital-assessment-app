import type { CompletedPart } from "@aws-sdk/client-s3";

export interface IInitMultipartUpload {
  bucket: string;
  key: string;
  contentType: string;
}

export interface IUploadPart {
  bucket: string;
  key: string;
  uploadId: string;
  partNumber: number;
  body: Buffer;
}

export interface ICompleteMultipartUpload {
  bucket: string;
  key: string;
  uploadId: string;
  parts: {
    PartNumber: number;
    ETag: string;
  }[];
}

export interface IAbortMultipartUpload {
  bucket: string;
  key: string;
  uploadId: string;
}