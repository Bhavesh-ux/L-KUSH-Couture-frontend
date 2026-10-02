
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Lock, Mail, ArrowRight, ExternalLink } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginOwner } = useAuth();
  const { addToast } = useToast();

 const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginOwner(email, password);
      addToast('Owner portal authenticated.', 'success');
      navigate('/admin');
    } catch (err) {
      setError(
        err.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-luxury-gold-400 transition-colors uppercase tracking-widest font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Return to Public Storefront</span>
        </Link>

        <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
          Single Business Owner Architecture
        </span>
      </div>

      {/* Main Form Box */}
      <div className="w-full max-w-md mx-auto my-12 bg-luxury-charcoal border border-neutral-800 shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-3">
          <img
            src={logoImg}
            alt="L-KUSH Couture"
            className="h-14 w-auto mx-auto object-contain"
          />

          <div className="inline-block px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-luxury-gold-500/10 text-luxury-gold-400 border border-luxury-gold-500/30">
            Exclusive Owner Access
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
            Atelier Management Portal
          </h1>

          <p className="text-xs text-neutral-400">
            Private administrative portal for the single business owner of
            L-KUSH Couture.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-xs text-rose-300 leading-snug">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
              Owner Email Address
            </label>

            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lkushcouture.com"
                className="w-full py-2.5 pl-9 pr-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-luxury-gold-500"
              />

              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
              Owner Access Key
            </label>

            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 pl-9 pr-3 bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-luxury-gold-500"
              />

              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
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
            Access Owner Dashboard
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-neutral-600">
        © {new Date().getFullYear()} L-KUSH Couture • Proprietary Atelier Management
      </div>
    </div>
  );
};

