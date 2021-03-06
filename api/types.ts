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
    picture?: string,
    deleted: boolean
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
    hashtags: HashtagType[],
    record: boolean,
    started: boolean,
    ended: boolean
}

export type GroupType = {
    id: string,
    pollTime: string,
    User_id: UserType,
    name: string
}

export type HashtagType = {
    title: string
}

export type TopicType = {
    title: string,
    user: number,
    User: UserType
}

export type AttendingType = {
    eventId: string,
    userId: string,
    id: BigInteger
}

export type Suggestion = {
    name: string,
    description: string,
    Topic_id: number,
    Group_id: number,
    time: string
}