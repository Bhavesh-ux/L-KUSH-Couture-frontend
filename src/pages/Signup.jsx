import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const { signupCustomer } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      await signupCustomer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });
      addToast('Welcome to L-KUSH Couture patron membership.', 'success');
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 shadow-luxury p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img src={logoImg} alt="L-KUSH Couture" className="h-12 w-auto mx-auto object-contain" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
            Create Client Profile
          </h1>
          <p className="text-xs text-neutral-500">
            Join the L-KUSH Couture circle for personalized styling & concierge orders.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-snug">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Singhania"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patron@example.com"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Phone Number (WhatsApp Preferred)
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full py-2.5 pl-9 pr-3 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="md"
            className="w-full mt-3"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
          >
            Create Patron Profile
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2">
          <span>Already have a client profile? </span>
          <Link to="/login" className="text-luxury-gold-700 font-bold uppercase hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
