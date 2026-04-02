import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from state, or default to home "/"
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    // ... your login logic (axios.post to /api/token/)
    
    if (success) {
      localStorage.setItem('token', response.data.access);
      navigate(from, { replace: true }); // Send them back to Checkout!
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login fields */}
    </form>
  );
};

export default Login;