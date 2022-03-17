import jwtDecode, { JwtPayload } from "jwt-decode";

const JWTManager = () => {
    let inMemoryToken: string | null = null;

    let refreshTokenTimeout: number | null = null;

    let userId: number | null = null;

    const LOGOUT_EVENT_NAME = 'logout';

    const getUserId = () => userId

    const getToken = () => inMemoryToken

    const setToken = (accessToken: string) => {
        inMemoryToken = accessToken

        //Decode and set count down to refresh
        const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken)
        userId = decoded.userId;
        setRefreshTokenTimeOut((decoded.exp as number) - (decoded.iat as number))

        return true
    }
    const abortRefreshToken = () => {
        if (refreshTokenTimeout) window.clearTimeout(refreshTokenTimeout)
        return true

    }
    const deleteToken = () => {
        inMemoryToken = null
        window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString())
        abortRefreshToken()
    }

    //to logout all tabs (nullify inMemoryToken)
    window.addEventListener('storage', event => {
        if (event.key === LOGOUT_EVENT_NAME) inMemoryToken = null
    })

    const getRefreshToken = async () => {
        try {
            const response = await fetch('http://localhost:4000/refresh_token', {
                credentials: 'include',
            })
            const data = await response.json() as { success: boolean, accessToken: string }
            setToken(data.accessToken)
            return true
        } catch (error) {
            console.error('UNAUTHENTICATION', error)
            deleteToken()
            return false
        }

    }
    const setRefreshTokenTimeOut = (delay: number) => {
        //5s before token expires
        refreshTokenTimeout = window.setTimeout(getRefreshToken, delay * 1000 - 5000)
    }
    return { getToken, setToken, getRefreshToken, deleteToken, getUserId }
}
export default JWTManager()