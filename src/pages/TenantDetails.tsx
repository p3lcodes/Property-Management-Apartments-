import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Home, Download, Calendar, CheckCircle, AlertCircle, Clock, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock tenant data
const mockTenants = [
  { id: '1', name: 'Mary Wanjiku', phone: '0712 345 001', email: 'mary@email.com', unit: 'A1', monthlyRent: 15000, balance: 0, status: 'paid', moveInDate: '2023-06-15' },
  { id: '2', name: 'James Omondi', phone: '0712 345 002', email: 'james@email.com', unit: 'A2', monthlyRent: 15000, balance: 7500, status: 'partial', moveInDate: '2023-08-01' },
  { id: '3', name: 'Grace Akinyi', phone: '0712 345 003', email: 'grace@email.com', unit: 'A3', monthlyRent: 18000, balance: 18000, status: 'overdue', moveInDate: '2023-04-10' },
  { id: '4', name: 'Peter Kamau', phone: '0712 345 004', email: 'peter@email.com', unit: 'B1', monthlyRent: 12000, balance: 0, status: 'paid', moveInDate: '2023-09-20' },
  { id: '5', name: 'Lucy Njeri', phone: '0712 345 005', email: 'lucy@email.com', unit: 'B2', monthlyRent: 12000, balance: 0, status: 'paid', moveInDate: '2023-07-05' },
  { id: '6', name: 'David Mwangi', phone: '0712 345 006', email: 'david@email.com', unit: 'B3', monthlyRent: 15000, balance: 30000, status: 'overdue', moveInDate: '2023-03-01' },
  { id: '7', name: 'Sarah Atieno', phone: '0712 345 007', email: 'sarah@email.com', unit: 'C1', monthlyRent: 20000, balance: 0, status: 'paid', moveInDate: '2023-10-15' },
  { id: '8', name: 'John Kipchoge', phone: '0712 345 008', email: 'john@email.com', unit: 'C2', monthlyRent: 20000, balance: 10000, status: 'partial', moveInDate: '2023-05-25' },
];

// Mock ledger data
interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number; // Charges, Rent
  credit: number; // Payments
  balance: number;
  reference?: string;
}

const generateLedger = (tenantId: string, monthlyRent: number): LedgerEntry[] => {
  const entries: LedgerEntry[] = [];
  let runningBalance = 0;

  // Add initial deposit
  entries.push({
    id: '1', date: '2023-06-15', description: 'Security Deposit', debit: monthlyRent, credit: 0, balance: monthlyRent, reference: 'INV-001'
  });
  entries.push({
    id: '2', date: '2023-06-15', description: 'Deposit Payment', debit: 0, credit: monthlyRent, balance: 0, reference: 'PAY-001'
  });

  // Generate 6 months of history
  for (let i = 5; i >= 0; i--) {
     const date = new Date();
     date.setMonth(date.getMonth() - i);
     date.setDate(1); // 1st of month
     const dateStr = date.toISOString().split('T')[0];

     // Rent Charge
     runningBalance += monthlyRent;
     entries.push({
        id: `rent-${i}`,
        date: dateStr,
        description: `Rent Charge - ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        debit: monthlyRent,
        credit: 0,
        balance: runningBalance,
        reference: `INV-${100+i}`
     });

     // Payment (simulate variations)
     const paymentDate = new Date(date);
     paymentDate.setDate(5); // Paid on 5th
     const paymentDateStr = paymentDate.toISOString().split('T')[0];
     
     if (tenantId === '3' && i === 0) {
        // Missed last payment
     } else if (tenantId === '2' && i === 0) {
        // Partial payment
        runningBalance -= (monthlyRent / 2);
        entries.push({
            id: `pay-${i}`,
            date: paymentDateStr,
            description: 'Rent Payment',
            debit: 0,
            credit: monthlyRent / 2,
            balance: runningBalance,
            reference: `MPESA-${200+i}`
         });
     } else {
        // Full payment
        runningBalance -= monthlyRent;
        entries.push({
            id: `pay-${i}`,
            date: paymentDateStr,
            description: 'Rent Payment',
            debit: 0,
            credit: monthlyRent,
            balance: runningBalance,
            reference: `MPESA-${200+i}`
         });
     }
  }

  return entries.reverse(); // Newest first
};

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const tenant = mockTenants.find(t => t.id === id);

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Tenant not found</p>
      </div>
    );
  }

  const ledger = generateLedger(tenant.id, tenant.monthlyRent);

  const handleDownloadStatement = () => {
    toast({
      title: 'Statement Downloaded',
      description: 'The PDF statement has been saved to your device.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Custom Desktop-Ready Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6"
            >
                <ArrowLeft size={18} />
                <span>Back to Tenants</span>
            </button>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-16 w-16 border-2 border-white/20">
                            <AvatarFallback className="text-xl font-bold bg-primary-foreground text-primary">
                                {tenant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
                            <div className="flex items-center gap-2 text-primary-foreground/80">
                                <span className="flex items-center gap-1"><Home size={14} /> Unit {tenant.unit}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Since {new Date(tenant.moveInDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" className="gap-2" onClick={handleDownloadStatement}>
                        <Download size={18} />
                         Statement
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" onClick={() => window.print()}>
                        <Printer size={18} />
                         Print
                    </Button>
                </div>
            </div>

            {/* Stats Cards Row Overlapping Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border/50">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className={`text-2xl font-bold ${tenant.balance > 0 ? 'text-destructive' : 'text-success'}`}>
                        KES {tenant.balance.toLocaleString()}
                    </p>
                </div>
                <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border/50">
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="text-2xl font-bold">KES {tenant.monthlyRent.toLocaleString()}</p>
                </div>
                <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border/50">
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium truncate">{tenant.phone}</p>
                </div>
                 <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border/50">
                    <p className="text-sm text-muted-foreground">Lease Status</p>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">Active Lease</Badge>
                </div>
            </div>
        </div>
      </div>

       <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-6">
        {/* Ledger */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold">Financial Statement</h2>
                    <p className="text-sm text-muted-foreground">Transaction history and payments</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead className="min-w-[200px]">Description</TableHead>
                            <TableHead className="w-[120px]">Reference</TableHead>
                            <TableHead className="text-right w-[140px]">Debit (Charge)</TableHead>
                            <TableHead className="text-right w-[140px]">Credit (Paid)</TableHead>
                            <TableHead className="text-right w-[140px] font-bold">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ledger.map((entry) => (
                            <TableRow key={entry.id} className="hover:bg-muted/20">
                                <TableCell className="font-medium text-muted-foreground">{entry.date}</TableCell>
                                <TableCell>
                                    <span className="font-medium">{entry.description}</span>
                                </TableCell>
                                <TableCell className="text-xs font-mono text-muted-foreground">{entry.reference}</TableCell>
                                <TableCell className="text-right">
                                    {entry.debit > 0 ? (
                                        <span>KES {entry.debit.toLocaleString()}</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {entry.credit > 0 ? (
                                        <span className="text-success font-medium">KES {entry.credit.toLocaleString()}</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-bold tabular-nums">
                                    KES {entry.balance.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="p-4 bg-muted/20 text-xs text-muted-foreground text-center border-t">
                End of statement generated on {new Date().toLocaleDateString()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;

