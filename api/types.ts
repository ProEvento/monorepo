export type UserType = {
    readonly id: string,
    firstName: string,
    lastName: string,
	email: string,
    github?: string,
    linkedin?: string,
    bio?: string,
    twitter?: string,
    username: string,
    picture?: string
}

export type EventType = {
    id: string,
    title: string,
    User_id: UserType, 
    priv: boolean,
    time: string,
    description: string,
    topics: string,
    meetingURL: string,
    comments: string,
    picture: string,
    Topic: TopicType,
    host: UserType,
    attendees: UserType[],
    started: boolean
}

export type TopicType = {
    title: string,
    user: number,
    User: UserType
}

export type AttendingType = {
    eventId: string,
    userId: string
    id: BigInteger
}