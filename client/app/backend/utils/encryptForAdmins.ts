// app/backend/utils/encryptForAdmins.ts
import { encryptWithDeterministicKey } from "./encryptWithDeterministicKey";
import { getServerContract } from "./getServerContract";

interface EncryptResult {
  success: boolean;
  data?: Record<string, string>;
  error?: string;
}

export const encryptForAdmins = async ({ 
  fileKey 
}: { 
  fileKey: string 
}): Promise<EncryptResult> => {
  if (!fileKey) {
    return {
      success: false,
      error: "No file key provided"
    };
  }

  try {
    const contract = await getServerContract();

    if (!contract) {
      return {
        success: false,
        error: "Contract not initialized"
      };
    }

    const adminsAddresses: string[] = await contract.getAdmins();
    if (!adminsAddresses?.length) {
      return {
        success: false,
        error: "No admins found in contract"
      };
    }

    const adminKeys: Record<string, string> = {};
    let successCount = 0;

    await Promise.all(
      adminsAddresses.map(async (adminAddress) => {
        try {
          const encryptedKey = await encryptWithDeterministicKey(adminAddress, fileKey);
          adminKeys[adminAddress] = encryptedKey;
          successCount++;
        } catch (err) {
          console.error(`Failed to encrypt for admin ${adminAddress}:`, err);
        }
      })
    );

    if (successCount === 0) {
      return {
        success: false,
        error: "Failed to encrypt for any admin"
      };
    }

    return {
      success: true,
      data: adminKeys
    };
  } catch (err) {
    console.error("encryptForAdmins error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown encryption error"
    };
  }
};