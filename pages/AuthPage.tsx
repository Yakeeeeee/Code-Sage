
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
  onLogin: (username: string, provider?: 'local' | 'google' | 'github' | 'facebook') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim(), 'local');
      navigate('/dashboard');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'facebook', mockName: string) => {
    setIsAuthenticating(provider);
    
    // Simulate OAuth delay
    setTimeout(() => {
      setIsAuthenticating(null);
      onLogin(mockName, provider);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs for aesthetics */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />

      {isAuthenticating && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">Connecting to {isAuthenticating}...</h2>
          <p className="text-gray-500 mt-2">Authenticating secure session</p>
        </div>
      )}

      <div className="w-full max-w-lg bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-10 md:p-14 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="text-6xl mb-6 inline-block">🎓</div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Join CodeSage</h2>
          <p className="text-gray-500 mt-3 text-lg">Choose a secure way to save your progress.</p>
        </div>

        {/* Social Logins */}
        <div className="space-y-3 mb-10">
          <button
            onClick={() => handleSocialLogin('google', 'Google Student')}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all group active:scale-[0.98]"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleSocialLogin('github', 'GitHub Dev')}
            className="w-full flex items-center justify-center gap-4 bg-gray-900 border-2 border-gray-900 py-4 rounded-2xl font-bold text-white hover:bg-black transition-all group active:scale-[0.98]"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <button
            onClick={() => handleSocialLogin('facebook', 'Facebook Student')}
            className="w-full flex items-center justify-center gap-4 bg-[#1877F2] border-2 border-[#1877F2] py-4 rounded-2xl font-bold text-white hover:bg-[#166fe5] transition-all group active:scale-[0.98]"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-10">
          <div className="border-t w-full absolute border-gray-100"></div>
          <span className="bg-white px-4 text-xs font-black text-gray-300 tracking-widest uppercase relative z-10">or use legacy</span>
        </div>

        <form onSubmit={handleLocalSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Custom Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 focus:outline-none transition-all text-lg font-medium placeholder:text-gray-300 bg-gray-50 focus:bg-white"
              placeholder="e.g. FutureCoder99"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-100 active:scale-95"
          >
            Enter Workspace
          </button>
        </form>

        <div className="mt-12 pt-8 border-t text-center space-y-2">
          <p className="text-sm text-gray-400 font-medium">Progress is synced to your profile ID.</p>
          <div className="flex justify-center gap-4 text-xs font-bold text-gray-300">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
