import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, Home, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    propertyName: '',
    pin: '',
    confirmPin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (formData.pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);

    try {
      const success = await signUp({
        fullName: formData.fullName,
        phone: formData.phone,
        propertyName: formData.propertyName,
        pin: formData.pin,
      });
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-8">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 mb-4"
        >
          <ArrowLeft size={18} />
          Back to login
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary-foreground/10 rounded-xl">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">P3L</h1>
            <p className="text-sm opacity-80">Property Management</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mt-4">Create Account</h2>
        <p className="text-sm opacity-80 mt-1">Set up your property in minutes</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-6 overflow-auto pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Mwangi"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0712 345 678"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyName">Property Name</Label>
            <div className="relative">
              <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="propertyName"
                name="propertyName"
                placeholder="Sunrise Apartments"
                value={formData.propertyName}
                onChange={handleChange}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">Create PIN</Label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pin"
                name="pin"
                type="password"
                placeholder="4-6 digit PIN"
                value={formData.pin}
                onChange={handleChange}
                className="pl-10 h-12"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPin"
                name="confirmPin"
                type="password"
                placeholder="Confirm PIN"
                value={formData.confirmPin}
                onChange={handleChange}
                className="pl-10 h-12"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ChevronRight size={20} className="ml-1" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
