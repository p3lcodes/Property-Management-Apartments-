import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, Lock, ChevronRight, User, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<'landlord' | 'caretaker' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'pin'>('password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
        setError("Please select a role");
        return;
    }

    setError('');
    setLoading(true);

    try {
      // Use the actual phone number entered by the user
      // The AuthContext will look up the user in the local store
      const success = await login(phone, pin);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Desktop Image Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 Mix-blend-overlay"></div>
        <div className="relative z-10 text-primary-foreground max-w-md">
           <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl w-fit">
              <Building2 size={48} />
           </div>
           <h1 className="text-4xl font-bold mb-4">Manage Your Properties With Confidence</h1>
           <p className="text-lg opacity-90">Streamline your rental operations, track payments, and manage tenants all in one place.</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Logo & Header */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2 text-primary">
               <Building2 size={32} />
               <span className="text-2xl font-bold tracking-tight">P3L Property</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-6">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
               <button
                 type="button"
                 onClick={() => setRole('landlord')}
                 className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                   role === 'landlord' 
                     ? 'border-primary bg-primary/5 text-primary' 
                     : 'border-border hover:border-primary/50 text-muted-foreground'
                 }`}
               >
                  <User size={24} />
                  <span className="font-semibold">Landlord</span>
               </button>
               <button
                 type="button"
                 onClick={() => setRole('caretaker')}
                 className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                   role === 'caretaker' 
                     ? 'border-primary bg-primary/5 text-primary' 
                     : 'border-border hover:border-primary/50 text-muted-foreground'
                 }`}
               >
                  <KeyRound size={24} />
                  <span className="font-semibold">Caretaker</span>
               </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Email or Phone Number</Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Enter your contact info"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="pin">Password</Label>
                    <button 
                        type="button"
                        onClick={() => setLoginMethod(prev => prev === 'password' ? 'pin' : 'password')}
                        className="text-xs text-primary font-medium hover:underline"
                    >
                        {loginMethod === 'password' ? 'Login with PIN instead' : 'Login with Password instead'}
                    </button>
                </div>
                
                {loginMethod === 'password' ? (
                   <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="pl-10 h-12"
                        required
                    />
                   </div>
                ) : (
                   <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="pin"
                        type="password"
                        placeholder="Enter your 4-digit PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="pl-10 h-12 text-center tracking-widest text-lg"
                        maxLength={4}
                        required
                    />
                   </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ChevronRight size={18} />
                </span>
              )}
            </Button>

            {/* Demo Shortcuts - Only for presentation */}
            <div className="pt-4 border-t border-dashed border-muted">
               <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wide">Demo Quick Login</p>
               <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setRole('landlord'); setPhone('john.doe@p3l.com'); setPin('1234'); }} className="text-xs py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded">
                     As Landlord
                  </button>
                  <button type="button" onClick={() => { setRole('caretaker'); setPhone('peter.caretaker@p3l.com'); setPin('5678'); }} className="text-xs py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded">
                     As Caretaker
                  </button>
               </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')} 
                className="text-primary font-semibold hover:underline"
              >
                Create one
              </button>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
