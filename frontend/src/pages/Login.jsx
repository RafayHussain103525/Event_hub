import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const location = useLocation();
  const successMessage = location.state?.message;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {successMessage && (
        <div className="max-w-md mx-auto mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 text-sm text-center">
            {successMessage}
          </p>
        </div>
      )}
      <LoginForm />
    </div>
  );
};

export default Login;