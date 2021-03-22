export type UserType = {
    // readonly id: string,
    firstName: string,
    lastName: string,
	email: string,
    github: string,
    linkedin: string,
    bio: string,
    twitter: string,
    username: string,
    picture: string
}

export type EventType = {
    private: boolean,
    invitedUsers: string,
    attendingUsers: string,
    time: string,
    description: string,
    topics: string,
    meetingURL: string,
    comments: string
}

export type AttendingType = {
    eventId: string,
    userId: string
}