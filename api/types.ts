export type UserType = {
    // readonly id: string,
    firstName: string,
    lastName: string,
	email: string,
    github: string,
    linkedin: string,
    bio: string,
    twitter: string,
    username: string
}

export type EventType = {
    title: string,
    User_id: UserType, 
    private: boolean,
    time: string,
    description: string,
    topics: string,
    meetingURL: string,
    id: BigInteger
}