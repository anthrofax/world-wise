import { useAuth } from "../contexts/FakeAuthContext"
import {Navigate} from 'react-router-dom'

function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth();
   
    return (isAuthenticated) ? children : <Navigate to="/"/>;
}

export default ProtectedRoute
