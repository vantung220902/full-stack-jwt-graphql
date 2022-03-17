import express from 'express'
import { verify } from 'jsonwebtoken'
import { Secret } from 'jsonwebtoken';
import { UserAuthPayload } from 'src/types/UserAuthPayload';
import { User } from './../entities/User';
import { sendRefreshToken } from '../utils/auth'
import { createToken } from './../utils/auth';
const router = express.Router()

router.get('/', async (req, res) => {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string]
    if (!refreshToken) return res.sendStatus(401)
    try {
        const decodedUser = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as UserAuthPayload
        const existingUser = await User.findOne(decodedUser.userId)
        if (!existingUser || existingUser.tokenVersion !== decodedUser.tokenVersion) return res.sendStatus(401)
        sendRefreshToken(res, existingUser)
        return res.json({
            success: true,
            accessToken: createToken('accessToken', existingUser)
        })

    } catch (error) {
        console.log('Error refreshToken', error)
        return res.sendStatus(403)
    }
})
export default router