export type AuthUser = {
    id: string
    username: string
    email: string | null
    avatarUrl: string
    role: 'USER' | 'ADMIN',
    noteLimit: number
    createdAt: string
}

export const useAuthUser = () => {
    return useState<AuthUser | null>('authUser', () => null)
}

export const useAuthLoaded = () => {
    return useState<boolean>('authLoaded', () => false)
}