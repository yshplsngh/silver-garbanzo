export type UserProfileType = {
    user: {
        id: number,
        name: string,
        picture: string,
        email: string,
        verified: boolean,
    },
    iat: number,
    exp: number
}