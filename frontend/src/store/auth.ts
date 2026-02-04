import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: number
    email: string
    full_name: string
    is_active: boolean
}

interface AuthState {
    token: string | null
    user: User | null
    isAuthenticated: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token: string, user: User) => {
                console.log("Login: Setting token and user", { token: token.substring(0, 20) + "...", user });
                set({ token, user, isAuthenticated: true });
            },
            logout: () => {
                console.log("Logout: Clearing token and user");
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)
