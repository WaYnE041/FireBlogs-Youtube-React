import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/UserContext'

function GuardedRoutes( { isRouteAccessible, redirectRoute = "/" }: { isRouteAccessible: boolean | undefined, redirectRoute: string }) {

  // const { isAuth, isAdmin } = useAuth()
  // if(isAuth() !== undefined && isAdmin !== undefined){
  //   console.log("isAuth is " + isAuth())
  //   console.log("isAdmin is " + isAdmin)
  //   console.log("isSignOut is " + (!isAuth() && !isAdmin))
  // }

  console.log("isroute accessible: " + isRouteAccessible)
  return (
    isRouteAccessible ? <Outlet/> : <Navigate to={redirectRoute}/>
  )
}

export default GuardedRoutes