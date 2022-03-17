import { Request, Response } from "express";
import { UserAuthPayload } from 'src/types/UserAuthPayload';

export interface Context{
    req: Request,
    res: Response,
    user: UserAuthPayload
}