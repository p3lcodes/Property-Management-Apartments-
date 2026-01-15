import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Building2, Upload, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// Mock vacant units
const vacantUnits = [
  { id: '4', number: 'A4', rent: 18000 },
  { id: '8', number: 'B4', rent: 15000 },
  { id: '11', number: 'C3', rent: 20000 },
  { id: '12', number: 'C4', rent: 20000 },
];

const AddTenant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    unit: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUnitChange = (value: string) => {
    setFormData(prev => ({ ...prev, unit: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Tenant added successfully',
      description: `${formData.fullName} has been added to Unit ${formData.unit}. Welcome message sent via WhatsApp.`,
    });

    setLoading(false);
    navigate('/tenants');
  };

  const selectedUnit = vacantUnits.find(u => u.number === formData.unit);

  return (
    <div className="mobile-container min-h-screen">
      <PageHeader
        title="Add New Tenant"
        showBack
      />

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="Tenant's full name"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
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
            <Label htmlFor="email">Email (Optional)</Label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tenant@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Unit *</Label>
            <Select value={formData.unit} onValueChange={handleUnitChange} required>
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-muted-foreground" />
                  <SelectValue placeholder="Choose a vacant unit" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {vacantUnits.map(unit => (
                  <SelectItem key={unit.id} value={unit.number}>
                    Unit {unit.number} - KES {unit.rent.toLocaleString()}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUnit && (
            <div className="kpi-card">
              <p className="text-sm font-medium text-foreground">Selected Unit Details</p>
              <p className="text-sm text-muted-foreground mt-1">
                Unit {selectedUnit.number} • Monthly Rent: KES {selectedUnit.rent.toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Upload Documents (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                ID, Agreement, or other files
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Adding Tenant...' : 'Add Tenant'}
              {!loading && <ChevronRight size={20} className="ml-1" />}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            A welcome message with deposit invoice will be sent to the tenant via WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddTenant;
