import { create } from 'zustand'
import { profileApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface ProfileState {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isFetching: boolean;
  setIsFetching: (isFetching: boolean) => void;
  avatarUrl: string | null;
  setAvatarUrl: (avatarUrl: string | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  formData: { first_name: string; last_name: string; email: string };
  setFormData: (data: Partial<{ first_name: string; last_name: string; email: string }>) => void;
  fetchProfile: (user: any, updateUser: any) => Promise<void>;
  saveProfile: (updateUser: any) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  isFetching: true,
  setIsFetching: (isFetching) => set({ isFetching }),
  avatarUrl: null,
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  formData: { first_name: '', last_name: '', email: '' },
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

  fetchProfile: async (user, updateUser) => {
    set({ isFetching: true });
    try {
      const response = await profileApi.getProfile();
      if (response && response.responseCode === 200 && response.result) {
        const userData = response.result;
        set({
          formData: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
          }
        });
        if (updateUser) updateUser(userData);
      } else {
        if (user) {
          set({
            formData: {
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              email: user.email || '',
            }
          });
        }
      }
    } catch (error) {
      if (user) {
        set({
          formData: {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
          }
        });
      }
      toast.error('Could not load profile data');
    } finally {
      set({ isFetching: false });
    }
  },

  saveProfile: async (updateUser) => {
    set({ isLoading: true });
    try {
      const { formData } = get();
      const response = await profileApi.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      if (response && response.responseCode === 200) {
        toast.success('Profile updated successfully!');
        set({ isEditing: false });
        if (updateUser && response.result) {
          updateUser(response.result);
        }
      } else {
        toast.error(response?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      set({ isLoading: false });
    }
  }
}));
