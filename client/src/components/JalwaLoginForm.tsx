import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, AtSign, Phone } from 'lucide-react';
import { motion } from "framer-motion";

interface JalwaLoginFormProps {
  onLoginSuccess: (token: string) => void;
  onClose: () => void;
}

const JalwaLoginForm = ({ onLoginSuccess, onClose }: JalwaLoginFormProps) => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Construct the login request body
      const loginBody = {
        // The login payload should match what Jalwa API expects
        credential: phoneOrEmail,
        password: password,
        loginType: loginMethod === 'phone' ? 1 : 2, // Assuming 1 for phone, 2 for email
        // Add any other required fields
      };

      // In real implementation, this would be a fetch to Jalwa's login API
      const response = await fetch('https://api.jalwaapi.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': window.navigator.userAgent,
          'Referer': 'https://www.jalwa.live/',
          'Origin': 'https://www.jalwa.live'
        },
        body: JSON.stringify(loginBody)
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      
      // Assuming the API returns a token in the response
      if (data.token) {
        // Store the token
        localStorage.setItem('jalwaAuthToken', data.token);
        onLoginSuccess(data.token);
      } else {
        throw new Error('No authentication token received');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo/development purposes - allows bypassing the real login
  const handleDemoLogin = () => {
    const demoToken = 'demo_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('jalwaAuthToken', demoToken);
    onLoginSuccess(demoToken);
  };

  return (
    <motion.div
      className="space-y-4 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white">Login to Jalwa</h3>
        <p className="text-sm text-gray-400">Enter your Jalwa account details to verify your deposit</p>
      </div>

      <div className="flex space-x-2 mb-4">
        <Button
          type="button"
          variant={loginMethod === 'phone' ? 'default' : 'outline'}
          onClick={() => setLoginMethod('phone')}
          className={loginMethod === 'phone' ? 'bg-[#00ECBE] text-gray-900' : 'text-[#00ECBE] border-[#00ECBE]'}
        >
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </Button>
        <Button
          type="button"
          variant={loginMethod === 'email' ? 'default' : 'outline'}
          onClick={() => setLoginMethod('email')}
          className={loginMethod === 'email' ? 'bg-[#00ECBE] text-gray-900' : 'text-[#00ECBE] border-[#00ECBE]'}
        >
          <AtSign className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="credential" className="text-white">
            {loginMethod === 'phone' ? 'Phone Number' : 'Email'}
          </Label>
          <Input
            id="credential"
            type={loginMethod === 'phone' ? 'tel' : 'email'}
            placeholder={loginMethod === 'phone' ? '+91 XXXXXXXXXX' : 'example@example.com'}
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your Jalwa password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#00ECBE] text-gray-900 hover:bg-[#00ECBE]/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#070b27] px-2 text-gray-400">Test Option</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#00ECBE] text-[#00ECBE] hover:bg-[#00ECBE]/10"
            onClick={handleDemoLogin}
          >
            Use Demo Token (For Testing)
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default JalwaLoginForm;