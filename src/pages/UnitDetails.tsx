import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, User, DollarSign, Wrench, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// Mock unit data
const mockUnits = [
  { id: '1', number: 'A1', tenantName: 'Mary Wanjiku', tenantId: '1', monthlyRent: 15000, arrears: 0, isOccupied: true },
  { id: '2', number: 'A2', tenantName: 'James Omondi', tenantId: '2', monthlyRent: 15000, arrears: 7500, isOccupied: true },
  { id: '3', number: 'A3', tenantName: 'Grace Akinyi', tenantId: '3', monthlyRent: 18000, arrears: 18000, isOccupied: true },
  { id: '4', number: 'A4', monthlyRent: 18000, arrears: 0, isOccupied: false },
  { id: '5', number: 'B1', tenantName: 'Peter Kamau', tenantId: '4', monthlyRent: 12000, arrears: 0, isOccupied: true },
];

// Mock expenses data for units
const mockExpenses = {
  '1': [
    { month: 'Oct', rent: 15000, expenses: 2000 },
    { month: 'Nov', rent: 15000, expenses: 1500 },
    { month: 'Dec', rent: 15000, expenses: 3000 },
    { month: 'Jan', rent: 15000, expenses: 1000 },
  ],
  '2': [
    { month: 'Oct', rent: 15000, expenses: 1800 },
    { month: 'Nov', rent: 15000, expenses: 2200 },
    { month: 'Dec', rent: 15000, expenses: 1000 },
    { month: 'Jan', rent: 7500, expenses: 500 },
  ],
  '3': [
    { month: 'Oct', rent: 18000, expenses: 2500 },
    { month: 'Nov', rent: 18000, expenses: 1800 },
    { month: 'Dec', rent: 0, expenses: 3500 },
    { month: 'Jan', rent: 0, expenses: 1200 },
  ],
};

const expenseBreakdown = [
  { name: 'Water', amount: 2500 },
  { name: 'Electricity', amount: 1800 },
  { name: 'Repairs', amount: 3200 },
  { name: 'Garbage', amount: 500 },
];

const UnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLandlord = user?.role === 'landlord';
  
  const unit = mockUnits.find(u => u.id === id);
  const [newRent, setNewRent] = useState(unit?.monthlyRent?.toString() || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!unit) {
    return (
      <div className="mobile-container min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unit not found</p>
      </div>
    );
  }

  const chartData = mockExpenses[id as keyof typeof mockExpenses] || [
    { month: 'Oct', rent: unit.monthlyRent, expenses: 1500 },
    { month: 'Nov', rent: unit.monthlyRent, expenses: 2000 },
    { month: 'Dec', rent: unit.monthlyRent, expenses: 1800 },
    { month: 'Jan', rent: unit.monthlyRent, expenses: 2200 },
  ];

  const totalRent = chartData.reduce((sum, d) => sum + d.rent, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const netProfit = totalRent - totalExpenses;

  const handleSaveRent = () => {
    const rentValue = parseInt(newRent, 10);
    if (isNaN(rentValue) || rentValue <= 0) {
      toast({
        title: 'Invalid rent',
        description: 'Please enter a valid rent amount.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Rent updated',
      description: `Unit ${unit.number} rent changed to KES ${rentValue.toLocaleString()}.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="mobile-container min-h-screen pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Unit {unit.number}</h1>
            <p className="text-sm opacity-80">
              {unit.isOccupied ? 'Occupied' : 'Vacant'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            unit.isOccupied ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
          }`}>
            {unit.isOccupied ? 'Occupied' : 'Vacant'}
          </div>
        </div>
      </div>

      <div className="content-area space-y-4">
        {/* Unit Info Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="text-xl font-bold">KES {unit.monthlyRent.toLocaleString()}</p>
                </div>
              </div>
              {isLandlord && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Rent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%] max-w-sm rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Change Rent for Unit {unit.number}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">New Monthly Rent (KES)</label>
                        <Input
                          type="number"
                          value={newRent}
                          onChange={(e) => setNewRent(e.target.value)}
                          placeholder="Enter new rent amount"
                        />
                      </div>
                      <Button onClick={handleSaveRent} className="w-full">
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {unit.isOccupied && unit.tenantName && (
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <User size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Current Tenant</p>
                  <p className="font-medium">{unit.tenantName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/tenants/${unit.tenantId}`)}
                >
                  View
                </Button>
              </div>
            )}

            {unit.arrears > 0 && (
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <DollarSign size={20} className="text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrears</p>
                  <p className="font-medium text-destructive">KES {unit.arrears.toLocaleString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rent vs Expenses Chart */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Rent vs Expenses (Last 4 Months)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip
                    formatter={(value: number) => `KES ${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="rent" name="Rent" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Rent</p>
                <p className="font-semibold text-success">KES {totalRent.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="font-semibold text-destructive">KES {totalExpenses.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Net Profit</p>
                <p className={`font-semibold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  KES {netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-muted-foreground" />
              <CardTitle className="text-base">Expense Breakdown (This Month)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {expenseBreakdown.map((expense) => (
                <div key={expense.name} className="flex items-center justify-between">
                  <span className="text-sm">{expense.name}</span>
                  <span className="font-medium">KES {expense.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t font-semibold">
                <span>Total</span>
                <span>KES {expenseBreakdown.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitDetails;
