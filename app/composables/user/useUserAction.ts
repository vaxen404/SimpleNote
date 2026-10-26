interface User {
    username: string,
    email: string,
    noteLimit: number,
    avatarUrl: string,
    createdAt: string,
}

export const useUserActions = () => {
    const user = useState<User | null>('user', () => null)

    const fetchUser = async () => {
        user.value = await $fetch<User>('/api/user/@me')
    }

    return {
        user,
        fetchUser
    }
}