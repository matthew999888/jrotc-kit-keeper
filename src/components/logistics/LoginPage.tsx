import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginPageProps {
  onLogin: (email: string) => void;
  loginError: string;
}

export const LoginPage = ({ onLogin, loginError }: LoginPageProps) => {
  const [loginEmail, setLoginEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-4">
      <div className="bg-card rounded-lg shadow-2xl p-8 max-w-md w-full border border-border">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦅</div>
          <h1 className="text-3xl font-bold text-primary">AFJROTC</h1>
          <h2 className="text-xl text-muted-foreground">Logistics Management</h2>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onLogin(loginEmail);
        }} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">
              Authorized Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <Input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your.email@school.edu"
                required
                className="pl-10"
              />
            </div>
          </div>
          
          {loginError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}
          
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Demo emails: instructor@school.edu, logistics@school.edu, cadet@school.edu
          </p>
        </div>
      </div>
    </div>
  );
};
