export type CustomUserContext = {
    user: {
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
        email?: string;
        email_verified?: boolean;
        gender?: string;
        birthdate?: string;
        zoneinfo?: string;
        locale?: string;
        phone_number?: string;
        updated_at?: number;

        //Custom
        firstName: string,
        lastName: string,
        github: string,
        linkedin: string,
        bio: string,
        twitterHandle: string,
        username: string
    },
    error?: Error,
    isLoading: boolean,
    checkSession: () => Promise<void>;
}