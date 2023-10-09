import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as gsu } from "@aws-sdk/s3-request-presigner";
import { customAlphabet } from "nanoid";

const nanoid = () => {
  return customAlphabet(
    "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM",
    12
  )();
};

export const getSignedUrl = async ({
  accessKeyId,
  bucket,
  key,
  secretAccessKey,
  apiVersion,
  expires,
  region,
  signatureVersion,
}) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    apiVersion: apiVersion || "2006-03-01",
    region: region || "us-east-1",
    signatureVersion: signatureVersion || "v4",
  });

  const params = {
    Bucket: bucket,
    Key: key || nanoid(),
  };

  try {
    const url = await gsu(s3, new PutObjectCommand(params), {
      expiresIn: expires || 3600,
    });

    return {
      status: 200,
      body: {
        message: "Success",
        url,
      },
    };
  } catch (error) {
    return {
      status: 418,
      body: {
        message: "Error",
        error,
      },
    };
  }
};
