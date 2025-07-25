import {z} from "zod"

export const CreateUserSchema = z.object({
    username : z.string().min(3).max(20),
    password: z.string(),
    email : z.email()
})
export const SigninSchema = z.object({
    email : z.email(),
    password: z.string(),
})

export const RoomSchema = z.object({
    name : z.string().min(3).max(20)
})