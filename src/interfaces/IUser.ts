export interface IUser {
    username: string,
    apiKey: string,
    uploads: number,
    id: string,
    selectedDomain?: string,
    embedData?: {
        title: string,
        description: string,
        color: string
    }
}

