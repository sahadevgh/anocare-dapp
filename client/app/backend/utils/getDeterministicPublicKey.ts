import * as crypto from "crypto";

// Deterministic RSA key generation from admin address
export function generateDeterministicKeyPair(adminAddress: string) {
    // Create a seed from the admin address
    const seed = crypto.createHash('sha256')
      .update(adminAddress)
      .digest();
      
    // Use the seed to generate deterministic keys
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      },
        seed: seed,
        saltLength: 32,
    });
    
    return { publicKey, privateKey };
  }