import { useAuth } from '../contexts/UserContext';
import { Navigate, Outlet } from 'react-router-dom';

function GuardedRoutes({ isRouteAccessible, redirectRoute = "/" }: { 
  isRouteAccessible: boolean | undefined;
  redirectRoute: string;
}) {

  const { isAuth, isAdmin } = useAuth();

  if(isAuth !== undefined && isAdmin !== undefined){
    console.log("isAuth is " + isAuth + "\n" + 
                "isAdmin is " + isAdmin + "\n" + 
                "isSignOut is " + (!isAuth && !isAdmin));
  }

  console.log("isroute accessible: " + isRouteAccessible);

  return (
    isRouteAccessible ? <Outlet/> : <Navigate to={redirectRoute}/>
  )
}

export default GuardedRoutes;