import { useState, useCallback } from 'react';
import { executeContract, queryContract } from '@/lib/linera';
import { useLinera } from '@/contexts/LineraContext';
import { toast } from 'sonner';

export function useLineraContract(applicationId: string) {
  const { isConnected } = useLinera();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (operation: any) => {
    if (!isConnected) {
      toast.error("Please connect your Linera wallet first");
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await executeContract(applicationId, operation);
      toast.success("Transaction submitted successfully");
      return result;
    } catch (err) {
      console.error("Mutation error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, isConnected]);

  const query = useCallback(async (queryString: string) => {
    try {
      return await queryContract(applicationId, queryString);
    } catch (err) {
      console.error("Query error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Query failed';
      setError(errorMessage);
      throw err;
    }
  }, [applicationId]);

  return { mutate, query, isLoading, error };
}
