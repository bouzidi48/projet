import { User, UserRegistrationData, Roles, ApiResponse } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "false";
let storedUserId: number | null = null;
const mockUsers: User[] = [
  { 
    id: 1, 
    username: 'user1', 
    email: 'user@gmail.com', 
    role: 'user',
    createdate: new Date('2024-06-28T19:22:55.000Z')
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const userService = {
  async register(userData: UserRegistrationData): Promise<ApiResponse<User>> {
    if (USE_MOCK) {
      await delay(500);
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        throw new ApiError('Cette adresse e-mail est déjà utilisée', 409);
      }
      const newUser: User = {
        ...userData,
        id: mockUsers.length + 1,
        role: 'user',
        createdate: new Date()
      };
      mockUsers.push(newUser);
      return {
        data: { ...newUser },
        statusCode: 201
      };
    } else {
      const response = await fetch(`${API_URL}/inscription/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || 'Erreur lors de l\'inscription', response.status);
      }
      return await response.json();
    }
  },

  async login(username: string, password: string): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      const user = mockUsers.find(u => u.username === username);
      if (user) {
        return {
          data: { user, message: "Connexion réussie" },
          statusCode: 200
        };
      }
      throw new ApiError('Nom d\'utilisateur ou mot de passe incorrect', 401);
    }  else {
      try {
        const payload = {
          username: username.trim(),
          password: password
        };
  
        console.log('Sending login payload:', JSON.stringify(payload));
  
        const response = await fetch(`${API_URL}/authentification/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
  
        const data = await response.json();
        console.log('API response:', data);
  
        if (!response.ok) {
          throw new ApiError(data.message || 'Échec de la connexion', response.status);
        }
  
        if (data.data) {
          this.setStoredUserId(data.data);
          console.log('User ID stored:', data.data);
        } else {
          console.warn('User ID not found in the login response. Full response:', JSON.stringify(data));
        }
  
        return {
          data: data,
          statusCode: data.statusCode
        };
      } catch (error) {
        console.error('Detailed error in auth.ts:', error);
        if (error instanceof ApiError) {
          throw error;
        } else if (error instanceof Error) {
          throw new ApiError(error.message, 500);
        } else {
          throw new ApiError('An unknown error occurred', 500);
        }
      }
    }
  },
  
  setStoredUserId(userId: number | null): void {
    if (userId !== null) {
      localStorage.setItem('userId', userId.toString());
      console.log('User ID set:', userId);
    } else {
      localStorage.removeItem('userId');
      console.log('User ID cleared');
    }
  },
  
  getStoredUserId(): number | null {
    const storedId = localStorage.getItem('userId');
    return storedId ? parseInt(storedId, 10) : null;
  },
  


  async logout(): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      return {
        data: { message: "Vous avez été déconnecté avec succès" },
        statusCode: 200
      };
    }  else {
      try {
        const response = await fetch(`${API_URL}/authentification/logout`, {
          method: 'POST',
          credentials: 'include',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new ApiError(errorData.message || 'Échec de la déconnexion', response.status);
        }
  
        // Clear the stored user ID
        this.setStoredUserId(null);
  
        console.log('Logout successful, user ID cleared');
  
        return await response.json();
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  },

  async isAuthenticated(): Promise<boolean> {
    if (USE_MOCK) {
      await delay(500);
      return true;
    } else {
      try {
        const response = await fetch(`${API_URL}/authentification/check`, {
          method: 'GET',
          credentials: 'include',
        });

        return response.ok;
      } catch (error) {
        console.error('Échec de la vérification d\'authentification', error);
        return false;
      }
    }
  },

  async getUserById(userId: number): Promise<ApiResponse<User>> {
    if (USE_MOCK) {
      await delay(500);
      return {
        data: mockUsers[0],
        statusCode: 200
      };
    }else {
      try {
        const response = await fetch(`${API_URL}/users/single/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new ApiError(errorData.message || 'Échec de la récupération des données de l\'utilisateur', response.status);
        }

        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError('Impossible de récupérer les données utilisateur', 500);
        }
      }
    }
  },


  async verifyRegistration(username: string, code: string): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      if (code === '123456') {  // Mock verification
        return {
          data: { message: 'Vérification réussie' },
          statusCode: 200
        };
      }
      throw new ApiError('Code de vérification invalide', 400);
    } else {
      const response = await fetch(`${API_URL}/inscription/verifierInscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, code }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || 'Échec de la vérification', response.status);
      }

      return await response.json();
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      const user = mockUsers.find(u => u.email === email);
      if (user) { 
        return {
          data: { message: 'Un code de réinitialisation a été envoyé à votre adresse e-mail.' },
          statusCode: 200
        };
      } else {
        throw new ApiError('Aucun compte associé à cette adresse e-mail n\'a été trouvé.', 404);
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/authentification/forgotPassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          return {
            data: { message: data.message || 'Un code de réinitialisation a été envoyé à votre adresse e-mail.' },
            statusCode: response.status
          };
        } else if (response.status === 404) {
          throw new ApiError('Aucun compte associé à cette adresse e-mail n\'a été trouvé.', 404);
        } else {
          throw new ApiError('Une erreur est survenue lors de la demande de réinitialisation du mot de passe.', response.status);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError('Une erreur inattendue est survenue.', 500);
        }
      }
    }
  },

  async verifyPasswordResetCode(code: string): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      if (code === '123456') {  // Mock verification
        return {
          data: { message: 'Code vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.' },
          statusCode: 200
        };
      }
      throw new ApiError('Code de vérification invalide.', 400);
    } else {
      try {
        const response = await fetch(`${API_URL}/authentification/verifierPasswordOublier`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          return {
            data: { message: data.message || 'Code vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.' },
            statusCode: response.status
          };
        } else {
          throw new ApiError('Code de vérification invalide.', response.status);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError('Une erreur inattendue est survenue lors de la vérification du code.', 500);
        }
      }
    }
  },

  async resetPassword(password: string, confirmPassword: string): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      return {
        data: { message: 'Votre mot de passe a été réinitialisé avec succès.' },
        statusCode: 200
      };
    } else {
      try {
        const response = await fetch(`${API_URL}/authentification/modifierPassword`, {
          method: 'Put',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password, confirmpassword: confirmPassword }),
          credentials: 'include',
        });
  
        if (response.ok) {
          const data = await response.json();
          return {
            data: { message: data.message || 'Votre mot de passe a été réinitialisé avec succès.' },
            statusCode: response.status
          };
        } else {
          throw new ApiError('La réinitialisation du mot de passe a échoué.', response.status);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError('Une erreur inattendue est survenue lors de la réinitialisation du mot de passe.', 500);
        }
      }
    }
  },

  async updateProfile(userId: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    if (USE_MOCK) {
      await delay(500);
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        return {
          data: mockUsers[userIndex],
          statusCode: 200
        };
      }
      throw new ApiError('Utilisateur non trouvé', 404);
    } else {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || 'Échec de la mise à jour du profil', response.status);
      }

      return await response.json();
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await delay(500);
      return {
        data: { message: 'Mot de passe changé avec succès' },
        statusCode: 200
      };
    } else {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || 'Échec du changement de mot de passe', response.status);
      }

      return await response.json();
    }
  },
  
};

export default userService;