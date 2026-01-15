import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, ArrowLeft, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock Data for the report
  const financialSummary = {
    collected: 485000,
    expected: 520000,
    arrears: 35000,
    expenses: 42000,
    netIncome: 443000
  };

  const unitPerformance = [
     { id: 'A1', type: '2BHK', tenant: 'Mary Wanjiku', status: 'Occupied', rent: 15000, balance: 0 },
     { id: 'A2', type: '2BHK', tenant: 'James Omondi', status: 'Occupied', rent: 15000, balance: 7500 },
     { id: 'A3', type: '3BHK', tenant: 'Grace Akinyi', status: 'Occupied', rent: 18000, balance: 18000 },
     { id: 'A4', type: '1BHK', tenant: '-', status: 'Vacant', rent: 12000, balance: 0 },
     { id: 'B1', type: '2BHK', tenant: 'Peter Kamau', status: 'Occupied', rent: 12000, balance: 0 },
     { id: 'B2', type: '2BHK', tenant: 'Lucy Njeri', status: 'Occupied', rent: 12000, balance: 0 },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
        {/* Actions Header - No Print */}
        <div className="bg-background border-b px-8 py-4 print:hidden">
             <div className="max-w-5xl mx-auto flex items-center justify-between">
                 <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                     <ArrowLeft size={16} /> Back to Dashboard
                 </Button>
                 <div className="flex gap-2">
                     <Button variant="outline" className="gap-2">
                         <Download size={16} /> Export PDF
                     </Button>
                     <Button className="gap-2" onClick={() => window.print()}>
                         <Printer size={16} /> Print Report
                     </Button>
                 </div>
             </div>
        </div>

        {/* Printable Report Content */}
        <div className="max-w-5xl mx-auto bg-white my-8 p-12 shadow-lg print:shadow-none print:m-0 print:p-0 min-h-screen">
            
            {/* Report Header */}
            <div className="flex items-start justify-between border-b pb-8 mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                         <Building2 size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user?.propertyName || 'Sunrise Apartments'}</h1>
                        <p className="text-sm text-gray-500">Property Management Report</p>
                        <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-primary">Monthly financial Statement</h2>
                    <p className="text-sm text-gray-500">Period: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Collected</p>
                    <p className="text-xl font-bold text-green-700">KES {financialSummary.collected.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Arrears</p>
                    <p className="text-xl font-bold text-red-600">KES {financialSummary.arrears.toLocaleString()}</p>
                </div>
                 <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Expenses</p>
                    <p className="text-xl font-bold text-gray-700">KES {financialSummary.expenses.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs text-primary/80 uppercase tracking-wider mb-1">Net Income</p>
                    <p className="text-xl font-bold text-primary">KES {financialSummary.netIncome.toLocaleString()}</p>
                </div>
            </div>

            {/* Unit Performance Table */}
            <div className="mb-12">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    Unit Performance & Occupancy
                </h3>
                <div className="rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-bold text-gray-700">Unit</TableHead>
                                <TableHead className="font-bold text-gray-700">Type</TableHead>
                                <TableHead className="font-bold text-gray-700">Tenant</TableHead>
                                <TableHead className="font-bold text-gray-700 text-right">Rent</TableHead>
                                <TableHead className="font-bold text-gray-700 text-right">Balance</TableHead>
                                <TableHead className="font-bold text-gray-700 text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {unitPerformance.map((unit) => (
                                <TableRow key={unit.id}>
                                    <TableCell className="font-medium">{unit.id}</TableCell>
                                    <TableCell className="text-gray-500">{unit.type}</TableCell>
                                    <TableCell>{unit.tenant}</TableCell>
                                    <TableCell className="text-right">KES {unit.rent.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-medium text-red-600">
                                        {unit.balance > 0 ? `KES ${unit.balance.toLocaleString()}` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            unit.status === 'Occupied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {unit.status.toUpperCase()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-8 text-center text-sm text-gray-400">
                <p>This is a computer-generated document and needs no signature.</p>
                <p>Generated by P3L Property Management System © 2026</p>
            </div>
        </div>
    </div>
  );
};

export default Reports;