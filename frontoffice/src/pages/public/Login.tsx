import { Navigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return <LoadingSpinner />;
    }
  
    if (user) {
      return <Navigate to="/home" replace />;
    }
  
    return (
        <>
        <LoginForm/>
        </>
    );
  };
  
  export default Login;