export type CustomUserContext = {
    user: User,
    error?: Error,
    isLoading: boolean,
    checkSession: () => Promise<void>;
}

export type User = Auth0User & DBUser

export type Auth0User = {
        // Auth0
        sub: string;
        name?: string;
        given_name?: string;
        family_name?: string;
        middle_name?: string;
        nickname?: string;
        preferred_username?: string;
        profile?: string;
        picture?: string;
        website?: string;
        email: string;
        email_verified?: boolean;
        gender?: string;
        birthdate?: string;
        zoneinfo?: string;
        locale?: string;
        phone_number?: string;
        updated_at?: number;
}

export type DBUser = {
        //Custom
        firstName: string,
        lastName: string,
        github: string,
        linkedin: string,
        bio: string,
        twitter: string,
        username: string,
        id: string,
        picture?: string,
        notifications: []
}

export type Chat = {
        //Custom
        id: number,
        title: string,
        group?: number,
        messages: Message[],
        members: DBUser[]
}

export type Message = {
        //Custom
        id: number,
        text: string,
        chatId: number,
        authorId: number,
        author: DBUser,
        createdAt: number,
}