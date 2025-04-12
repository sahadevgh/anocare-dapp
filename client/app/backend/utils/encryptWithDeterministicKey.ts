import * as crypto from "crypto";
import { generateDeterministicKeyPair } from "./getDeterministicPublicKey";

// Encrypt with deterministic public key
export async function encryptWithDeterministicKey(
    adminAddress: string, 
    data: string
  ): Promise<string> {
    try {
      // Generate deterministic key pair for this admin
      const { publicKey } = generateDeterministicKeyPair(adminAddress);
      
      const buffer = Buffer.from(data, 'utf-8');
      
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256"
        },
        buffer
      );
      
      return encrypted.toString("base64");
    } catch (err) {
      console.error(`Encryption failed for admin ${adminAddress}:`, err);
      throw new Error(`Encryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }