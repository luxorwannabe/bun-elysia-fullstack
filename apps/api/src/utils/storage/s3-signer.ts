import { createHmac, createHash } from 'node:crypto';

/**
 * AWS Signature V4 Utility
 * 
 * This utility handles the complex cryptographic signing process required
 * by the S3 REST API without needing the heavy AWS SDK.
 * 
 * All comments are in English as per requirements.
 */

async function hmac(key: Buffer | string | Uint8Array, data: string): Promise<Buffer> {
  return createHmac('sha256', key).update(data).digest();
}

async function hash(data: string | Uint8Array): Promise<string> {
  return createHash('sha256').update(data).digest('hex');
}

export interface S3SignOptions {
  method: string;
  url: string;
  region: string;
  accessKey: string;
  secretKey: string;
  payloadHash?: string;
  headers?: Record<string, string>;
}

export async function signS3Request(options: S3SignOptions) {
  const { method, url, region, accessKey, secretKey, payloadHash = 'UNSIGNED-PAYLOAD' } = options;
  const service = 's3';
  const urlObj = new URL(url);
  const host = urlObj.host;
  const path = urlObj.pathname;
  
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  
  const canonicalRequest = [
    method,
    path,
    '', // query string
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await hash(canonicalRequest)
  ].join('\n');

  const kDate = await hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');
  
  const signature = Buffer.from(await hmac(kSigning, stringToSign)).toString('hex');

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    'Authorization': authorizationHeader,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
    'Host': host
  };
}
