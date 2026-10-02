import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const redirectPath = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await loginCustomer(email.trim(), password, rememberMe);
      addToast('Welcome back to L-KUSH Couture.', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    addToast(`Password recovery link sent to ${forgotEmail}`, 'success');
    setForgotModalOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 shadow-luxury p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img src={logoImg} alt="L-KUSH Couture" className="h-12 w-auto mx-auto object-contain" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
            Client Sign In
          </h1>
          <p className="text-xs text-neutral-500">
            Access your private bespoke wishlist, orders, and saved looks.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-snug">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@example.com"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="uppercase tracking-wider font-semibold text-neutral-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-luxury-gold-700 hover:text-luxury-gold-800 font-semibold uppercase tracking-wider"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-luxury-gold-500 w-4 h-4"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="md"
            className="w-full mt-2"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
          >
            Sign In to Profile
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-neutral-500 pt-2">
          <span>New to L-KUSH Couture? </span>
          <Link to="/signup" className="text-luxury-gold-700 font-bold uppercase hover:underline">
            Register Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Password Recovery"
        subtitle="We will dispatch a secure reset link to your registered email"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="patron@example.com"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
            />
          </div>
          <Button type="submit" variant="gold" size="md" className="w-full">
            Dispatch Recovery Link
          </Button>
        </form>
      </Modal>
    </div>
  );
};
