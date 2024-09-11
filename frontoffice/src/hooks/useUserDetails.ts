import { useState, useEffect } from 'react';
import { userService } from '../services/auth';
import { User, ApiResponse } from '../types/user';

export function useUserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserDetails() {
      const userId = userService.getStoredUserId();
      if (!userId) {
        setError('No stored user ID found');
        setLoading(false);
        return;
      }

      try {
        const response: ApiResponse<User> = await userService.getUserById(userId);
        if (response.statusCode === 200 && response.data) {
          setUser(response.data);
        } else {
          setError('Failed to fetch user details');
        }
      } catch (err) {
        setError('An error occurred while fetching user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

  return { user, loading, error };
}