export class WebCrypto {
    static async generateKey(): Promise<CryptoKey> {
      return window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
    }
  
    static async encryptFile(file: File, key: CryptoKey): Promise<Blob> {
      // Generate initialization vector
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Read file as ArrayBuffer
      const fileData = await file.arrayBuffer();
      
      // Encrypt the data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        fileData
      );
      
      // Combine IV and encrypted data into a single Blob
      return new Blob([iv, new Uint8Array(encryptedData)], {
        type: "application/octet-stream"
      });
    }
  
    static async exportKey(key: CryptoKey): Promise<string> {
      const exported = await window.crypto.subtle.exportKey("jwk", key);
      return JSON.stringify(exported);
    }
  
    static async importKey(keyStr: string): Promise<CryptoKey> {
      const keyData = JSON.parse(keyStr);
      return window.crypto.subtle.importKey(
        "jwk",
        keyData,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
      );
    }
  }