import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useUserData = () => {
  const { address, isConnected } = useAccount();
  interface UserData {
    _id: string;
    name: string;
    email: string;
    address: string;
    experience: string;
    specialty: string;
    status: string;
    isActive: boolean;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!isConnected || !address) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${address}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUserData(data.user);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [address, isConnected]);

  return { userData, isLoading, error, refetch: fetchUserData };
};
