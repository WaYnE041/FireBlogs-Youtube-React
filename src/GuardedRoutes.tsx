import { Navigate, Outlet } from 'react-router-dom'

function GuardedRoutes( { isRouteAccessible, redirectRoute = "/" }: { isRouteAccessible: boolean, redirectRoute: string }) {
  console.log("isroute accessible: " + isRouteAccessible)
  return (
    isRouteAccessible ? <Outlet/> : <Navigate to={redirectRoute}/>
  )
}

export default GuardedRoutes