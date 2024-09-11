// src/services/user.ts

import { User } from "../types/user";

// Mock user data
let mockUser: User = {
  username: "user123",
  name: "John Doe",
  email: "john@example.com",
};

// Mock API delay
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const UserService = {
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    await mockDelay(300);
    return { ...mockUser };
  },

  // Update user profile
  updateUserProfile: async (updatedUser: Partial<User>): Promise<User> => {
    await mockDelay(500);
    mockUser = { ...mockUser, ...updatedUser };
    return { ...mockUser };
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    await mockDelay(500);
    // In a real app, you'd verify the current password and hash the new password
    // For this mock service, we'll just simulate a successful password change
    return true;
  }
};