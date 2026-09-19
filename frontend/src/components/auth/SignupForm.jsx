import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = () => {
  const [accountType, setAccountType] = useState('user');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup, signupOrganizerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    
    if (!formData.email || !formData.password || !formData.phone_number) {
      setFormError('Please fill in all fields');
      return;
    }

    if (accountType === 'user' && !formData.username) {
      setFormError('Username is required');
      return;
    }

    if (accountType === 'organizer' && !formData.name) {
      setFormError('Organization name is required');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
      };

      const result =
        accountType === 'organizer'
          ? await signupOrganizerUser({ ...payload, name: formData.name })
          : await signup({ ...payload, username: formData.username });

      if (result.success) {
        navigate('/login', {
          state: { message: 'Account created! Please sign in.' },
        });
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
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Create your account
        </h2>
        <p className="text-gray-500 mb-6">
          Join EventHub to discover or organize events
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {accountType === 'user' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                maxLength={50}
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Events Co."
                maxLength={100}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="03001234567"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
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
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;