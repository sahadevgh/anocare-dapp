declare module "lit-js-sdk" {
    // Define proper types for AuthSig and AccessControlConditions
    type AuthSig = {
      sig: string;
      derivedVia: string;
      signedMessage: string;
      address: string;
    };
  
    type AccessControlCondition = {
      contractAddress: string;
      standardContractType: string;
      chain: string;
      method: string;
      parameters: string[];
      returnValueTest: {
        comparator: string;
        value: string;
      };
    };
  
    export class LitNodeClient {
      connect(): Promise<void>;
      saveEncryptionKey(params: {
        accessControlConditions: AccessControlCondition[];
        symmetricKey: Uint8Array;
        authSig: AuthSig;
        chain: string;
      }): Promise<Uint8Array>;
    }
  
    export function encryptFile(params: { file: File }): Promise<{
      encryptedFile: Blob;
      symmetricKey: Uint8Array;
    }>;
  
    export namespace LitNodeClient {
      function checkAndSignAuthMessage(params: { chain: string }): Promise<AuthSig>;
    }
  }