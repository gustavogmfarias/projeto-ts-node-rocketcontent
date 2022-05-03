import { IStorageProvider } from '../IStorageProvider';
import { resolve } from 'path';
import { S3 } from 'aws-sdk';
import fs from 'fs';
import upload from '@config/upload';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({ region: process.env.aws_bucket_region });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalName);

    await this.client.putObject({
      Bucket: `${process.env.AWS_BUCKET}/${folder}`,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType: 
    });
  }
  delete(file: string, folder: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export { S3StorageProvider };
