import { Link, Outlet } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { useLogoutMutation } from "../generated/graphql"
import JWTManager from './../utils/jwt';

const Layout = () => {
    const { isAuthenticated, logoutClient } = useAuthContext()
    const [logoutServer, _] = useLogoutMutation()
    const logout = async () => {
        logoutClient()
        await logoutServer({ variables: { userId: JWTManager.getUserId()?.toString() as string } })
       
    }
    return (
        <div>
            <h1>JWT Authorization full stack</h1>
            <nav style={{ borderBottom: '1px solid', paddingBottom: '1rem' }}>
                <Link to="." style={{ margin: '4px' }}>
                    Home
                </Link>
              
                |
                <Link to="register" style={{ margin: '4px' }}>
                    Register
                </Link>
                |
                <Link to="profile" style={{ margin: '4px' }}>
                    Profile
                </Link>

                {isAuthenticated ? <>
                    |
                    <button style={{ margin: '4px' }} onClick={logout}>
                        Logout
                    </button></> :  <>
                    |
                    <Link to="login" style={{ margin: '4px' }}>
                        Login
                    </Link></>}
            </nav>
            <Outlet />
        </div>

    )
}

export default Layout