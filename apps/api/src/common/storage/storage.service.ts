import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export interface StorageMetadata {
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  eTag?: string;
  customMetadata?: Record<string, string>;
}

export interface StorageService {
  putObject(
    key: string,
    buffer: Buffer,
    mimeType?: string,
    metadata?: Record<string, string>,
  ): Promise<void>;
  getObject(key: string): Promise<Buffer>;
  deleteObject(key: string): Promise<void>;
  objectExists(key: string): Promise<boolean>;
  getMetadata(key: string): Promise<StorageMetadata>;
  createDownloadStream(key: string): Promise<Readable>;
  isHealthy(): Promise<boolean>;
}

/**
 * Helper to convert readable stream to Buffer
 */
async function streamToBuffer(stream: any): Promise<Buffer> {
  if (Buffer.isBuffer(stream)) return stream;
  if (stream instanceof Uint8Array) return Buffer.from(stream);
  if (typeof stream?.transformToByteArray === 'function') {
    const bytes = await stream.transformToByteArray();
    return Buffer.from(bytes);
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Production S3 / MinIO Storage Implementation
 * Private bucket, backend-mediated access only.
 */
export class S3StorageService implements StorageService {
  private client: S3Client;
  private bucket: string;

  constructor(config?: {
    endpoint?: string;
    region?: string;
    bucket?: string;
    accessKey?: string;
    secretKey?: string;
    forcePathStyle?: boolean;
  }) {
    const isProd = process.env.NODE_ENV === 'production';
    const endpoint = config?.endpoint || process.env.S3_ENDPOINT;
    const region = config?.region || process.env.S3_REGION || (isProd ? undefined : 'us-east-1');
    const bucket = config?.bucket || process.env.S3_BUCKET || (isProd ? undefined : 'panacea-documents');
    const accessKeyId = config?.accessKey || process.env.S3_ACCESS_KEY || '';
    const secretAccessKey = config?.secretKey || process.env.S3_SECRET_KEY || '';

    if (isProd) {
      if (!bucket) {
        throw new Error(
          '[STORAGE] FATAL: Production requires explicit S3_BUCKET configuration. Default bucket names are strictly forbidden.',
        );
      }
      if (!accessKeyId || !secretAccessKey) {
        throw new Error(
          '[STORAGE] FATAL: Production requires valid S3/MinIO credentials (S3_ACCESS_KEY, S3_SECRET_KEY).',
        );
      }
      if (!endpoint && !region) {
        throw new Error(
          '[STORAGE] FATAL: Production requires explicit S3_ENDPOINT or S3_REGION configuration.',
        );
      }
      if (endpoint && (endpoint.includes('localhost') || endpoint.includes('127.0.0.1') || endpoint.includes('9000'))) {
        throw new Error(
          '[STORAGE] FATAL: Localhost storage endpoint forbidden in production. Production requires dedicated cloud object storage.',
        );
      }
    }

    this.bucket = bucket || 'panacea-documents';

    const forcePathStyle =
      config?.forcePathStyle ??
      (process.env.S3_FORCE_PATH_STYLE === 'true' || Boolean(endpoint));

    this.client = new S3Client({
      endpoint: endpoint || undefined,
      region,
      credentials:
        accessKeyId && secretAccessKey
          ? { accessKeyId, secretAccessKey }
          : undefined,
      forcePathStyle,
    });
  }

  public async putObject(
    key: string,
    buffer: Buffer,
    mimeType = 'application/octet-stream',
    metadata: Record<string, string> = {},
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        Metadata: metadata,
      });
      await this.client.send(command);
    } catch (err: any) {
      throw new Error(`[STORAGE] Failed to write object ${key}: ${err.message}`);
    }
  }

  public async getObject(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      if (!response.Body) {
        throw new Error(`[STORAGE] Empty body returned for object ${key}`);
      }
      return await streamToBuffer(response.Body);
    } catch (err: any) {
      throw new Error(`[STORAGE] Failed to read object ${key}: ${err.message}`);
    }
  }

  public async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
    } catch (err: any) {
      throw new Error(`[STORAGE] Failed to delete object ${key}: ${err.message}`);
    }
  }

  public async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw new Error(`[STORAGE] Error checking object ${key}: ${err.message}`);
    }
  }

  public async getMetadata(key: string): Promise<StorageMetadata> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const res = await this.client.send(command);
      return {
        contentType: res.ContentType,
        contentLength: res.ContentLength,
        lastModified: res.LastModified,
        eTag: res.ETag,
        customMetadata: res.Metadata,
      };
    } catch (err: any) {
      throw new Error(`[STORAGE] Failed to retrieve metadata for ${key}: ${err.message}`);
    }
  }

  public async createDownloadStream(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      if (!response.Body) {
        throw new Error(`[STORAGE] Object ${key} body stream unavailable`);
      }
      if (response.Body instanceof Readable) {
        return response.Body;
      }
      const buffer = await streamToBuffer(response.Body);
      return Readable.from(buffer);
    } catch (err: any) {
      throw new Error(`[STORAGE] Failed to create stream for ${key}: ${err.message}`);
    }
  }

  public async isHealthy(): Promise<boolean> {
    try {
      const command = new HeadBucketCommand({
        Bucket: this.bucket,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Isolated Test / Non-Production In-Memory Storage
 * Refuses execution if NODE_ENV === 'production'.
 */
export class MemoryStorageService implements StorageService {
  private vault = new Map<string, { buffer: Buffer; mimeType: string; metadata?: Record<string, string> }>();

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[STORAGE] FATAL: MemoryStorageService is strictly forbidden in production. Production must use S3/MinIO.',
      );
    }
  }

  public async putObject(
    key: string,
    buffer: Buffer,
    mimeType = 'application/octet-stream',
    metadata?: Record<string, string>,
  ): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[STORAGE] In-memory storage cannot be used in production.');
    }
    this.vault.set(key, { buffer, mimeType, metadata });
  }

  public async getObject(key: string): Promise<Buffer> {
    const item = this.vault.get(key);
    if (!item) {
      throw new Error(`[STORAGE] Object not found: ${key}`);
    }
    return item.buffer;
  }

  public async deleteObject(key: string): Promise<void> {
    this.vault.delete(key);
  }

  public async objectExists(key: string): Promise<boolean> {
    return this.vault.has(key);
  }

  public async getMetadata(key: string): Promise<StorageMetadata> {
    const item = this.vault.get(key);
    if (!item) {
      throw new Error(`[STORAGE] Object not found: ${key}`);
    }
    return {
      contentType: item.mimeType,
      contentLength: item.buffer.length,
      lastModified: new Date(),
    };
  }

  public async createDownloadStream(key: string): Promise<Readable> {
    const buffer = await this.getObject(key);
    return Readable.from(buffer);
  }

  public async isHealthy(): Promise<boolean> {
    if (process.env.NODE_ENV === 'production') return false;
    return true;
  }

  // Helper for test fixture preloading
  public seedObject(key: string, content: Buffer, mimeType = 'application/pdf') {
    this.vault.set(key, { buffer: content, mimeType });
  }
}

/**
 * Storage Service Factory
 * Injects S3StorageService for production, or MemoryStorageService for test/local mocks when configured.
 */
class StorageServiceRegistry {
  private static instance: StorageService;

  public static getService(): StorageService {
    if (!StorageServiceRegistry.instance) {
      if (process.env.NODE_ENV === 'production') {
        StorageServiceRegistry.instance = new S3StorageService();
      } else if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
        StorageServiceRegistry.instance = new S3StorageService();
      } else {
        const mem = new MemoryStorageService();
        // Seed default seed documents for dev/test
        mem.seedObject(
          'secure_vault/icici/c1111111/dm_order_certified_9102.pdf',
          Buffer.from('%PDF-1.4\n%Panacea Encrypted Certified DM Section 14 Order\n%%EOF'),
        );
        mem.seedObject(
          'secure_vault/icici/c2222222/sec13_2_served_proof_4401.pdf',
          Buffer.from('%PDF-1.4\n%Panacea Demand Notice Proof of Service\n%%EOF'),
        );
        mem.seedObject(
          'secure_vault/axis/c4444444/sec14_application_draft_1120.pdf',
          Buffer.from('%PDF-1.4\n%Panacea Section 14 Application Draft\n%%EOF'),
        );
        StorageServiceRegistry.instance = mem;
      }
    }
    return StorageServiceRegistry.instance;
  }

  public static setService(service: StorageService): void {
    if (process.env.NODE_ENV === 'production' && service instanceof MemoryStorageService) {
      throw new Error('[STORAGE] Cannot inject MemoryStorageService in production.');
    }
    StorageServiceRegistry.instance = service;
  }
}

export const getStorageService = (): StorageService => StorageServiceRegistry.getService();
export const setStorageService = (s: StorageService): void => StorageServiceRegistry.setService(s);
