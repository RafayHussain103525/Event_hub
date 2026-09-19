import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('user'); // 'user' or 'organizer'
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginOrganizerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = { email, password };
      const result =
        accountType === 'organizer'
          ? await loginOrganizerUser(credentials)
          : await login(credentials);

      if (result.success) {
        const redirectTo =
          accountType === 'organizer' ? '/my-events' : from;
        navigate(redirectTo, { replace: true });
      } else {
        setFormError(result.error);
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Welcome back</h2>
        <p className="text-gray-500 mb-6">Sign in to your account</p>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 bg-gray-950 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                accountType === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setAccountType('organizer')}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                accountType === 'organizer'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Organizer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;