'use client';
import React from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Login attempt:', formData);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
              <Sparkles className='w-5 h-5 text-white fill-white' />
            </div>
            <h1 className='font-mondwest text-3xl font-bold text-blue-600'>
              Firenze
            </h1>
          </div>
          <h2 className='font-mondwest text-2xl font-bold text-gray-900 mb-2'>
            Welcome back!
          </h2>
          <p className='font-family-founders text-gray-600'>
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label 
                htmlFor='email' 
                className='font-family-founders block text-sm font-medium text-gray-700 mb-2'
              >
                Email address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='font-family-founders w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500'
                placeholder='Enter your email'
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor='password' 
                className='font-family-founders block text-sm font-medium text-gray-700 mb-2'
              >
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='font-family-founders w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500'
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500 focus:ring-2'
                />
                <span className='font-family-founders ml-2 text-sm text-gray-600'>
                  Remember me
                </span>
              </label>
              <button
                type='button'
                className='font-family-founders text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200'
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='font-family-mondwest w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          {/*<div className='my-6 flex items-center'>*/}
          {/*  <div className='flex-1 border-t border-gray-200'></div>*/}
          {/*  <span className='font-family-founders px-4 text-sm text-gray-500'>*/}
          {/*    Or continue with*/}
          {/*  </span>*/}
          {/*  <div className='flex-1 border-t border-gray-200'></div>*/}
          {/*</div>*/}

          {/* Social Login Buttons */}
          {/*<div className='space-y-3'>*/}
          {/*  <button*/}
          {/*    type='button'*/}
          {/*    className='font-family-founders w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200'*/}
          {/*  >*/}
          {/*    <svg className='w-5 h-5' viewBox='0 0 24 24'>*/}
          {/*      <path*/}
          {/*        fill='#4285F4'*/}
          {/*        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'*/}
          {/*      />*/}
          {/*      <path*/}
          {/*        fill='#34A853'*/}
          {/*        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'*/}
          {/*      />*/}
          {/*      <path*/}
          {/*        fill='#FBBC05'*/}
          {/*        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'*/}
          {/*      />*/}
          {/*      <path*/}
          {/*        fill='#EA4335'*/}
          {/*        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*    Continue with Google*/}
          {/*  </button>*/}

          {/*  <button*/}
          {/*    type='button'*/}
          {/*    className='font-family-founders w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200'*/}
          {/*  >*/}
          {/*    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>*/}
          {/*      <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.098-1.016 2.717-1.4 3.585 1.354.418 2.786.64 4.279.64 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z'/>*/}
          {/*    </svg>*/}
          {/*    Continue with Pinterest*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>

        {/* Footer */}
        <div className='text-center mt-6'>
          <p className='font-family-founders text-gray-600'>
            Don't have an account?{' '}
            <button className='text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200'>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
