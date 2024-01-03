import {
  generateKeyPair,
  publicEncrypt,
  privateDecrypt,
  constants,
  privateEncrypt,
  publicDecrypt,
} from "crypto";

// TODO: look into how to use a dynamic passphrase
export const generatePrivatePublicKeys = (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  return new Promise((resolve, reject) =>
    generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          // passphrase: process.env.RSA_PASSPHRASE,
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          return reject(err);
        }

        return resolve({ publicKey, privateKey });
      }
    )
  );
};

export const encryptWithPublicKey = (data: string, publicKey: string) =>
  publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },

    Buffer.from(data)
  ).toString();

export const decryptWithPrivatekey = (
  encryptedData: Buffer,
  privateKey: string
) =>
  privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedData
  ).toString();

export const encryptWithPrivateKey = (data: string, privateKey: string) =>
  privateEncrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data)
  );

export const decryptWithPublicKey = (
  encryptedData: Buffer,
  publicKey: string
) =>
  publicDecrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedData)
  );
