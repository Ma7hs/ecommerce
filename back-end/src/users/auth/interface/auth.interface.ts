import { VerifyCallback } from "passport-google-oauth20"

export interface SignUPParams{
    name: string,
    email: string,
    password: string
}

export interface SignINParams{
    email: string,
    password: string
}

export interface GoogleSignIn{
    acessToken: string,
    refreshToken: string,
    profile: any 
    done: VerifyCallback
}