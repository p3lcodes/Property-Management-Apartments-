import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Filter, Smartphone, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Payment Data
const mockPayments = [
  { id: 'TRX-9872', date: '2023-11-28', tenant: 'James Omondi', unit: 'A2', amount: 15000, method: 'Mpesa', reference: 'QKD829XK3M', status: 'verified' },
  { id: 'TRX-9873', date: '2023-11-28', tenant: 'Grace Akinyi', unit: 'A3', amount: 18000, method: 'Bank Transfer', reference: 'FT23332190', status: 'pending' },
  { id: 'TRX-9874', date: '2023-11-27', tenant: 'Unknown', unit: 'N/A', amount: 7500, method: 'Mpesa', reference: 'QKC721PL9M', status: 'unreconciled' },
  { id: 'TRX-9875', date: '2023-11-26', tenant: 'David Mwangi', unit: 'B3', amount: 10000, method: 'Cash', reference: 'RECEIPT-001', status: 'verified' },
  { id: 'TRX-9876', date: '2023-11-25', tenant: 'Sarah Atieno', unit: 'C1', amount: 20000, method: 'Mpesa', reference: 'QKA558ND2P', status: 'verified' },
  { id: 'TRX-9877', date: '2023-11-25', tenant: 'John Kipchoge', unit: 'C2', amount: 20000, method: 'Bank Transfer', reference: 'FT23331188', status: 'verified' },
];

const Payments = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMethod, setFilterMethod] = useState('all');

    const filteredPayments = mockPayments.filter(payment => {
        const matchesSearch = 
            payment.tenant.toLowerCase().includes(searchQuery.toLowerCase()) || 
            payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMethod = filterMethod === 'all' || payment.method.toLowerCase().replace(' ', '') === filterMethod;
        return matchesSearch && matchesMethod;
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'verified': return 'bg-success/10 text-success hover:bg-success/20 border-success/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20';
            case 'unreconciled': return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-12">
            <div className="bg-background border-b px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Payments</h1>
                        <p className="text-muted-foreground mt-1">Track rent collection and financial transactions</p>
                    </div>
                     <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download size={18} />
                            Export
                        </Button>
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            + Record Payment
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Collected (Nov)</CardTitle>
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">KES 485,000</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">KES 45,000</div>
                            <p className="text-xs text-muted-foreground">3 transactions pending</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unreconciled</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">KES 7,500</div>
                             <p className="text-xs text-muted-foreground">1 payment with unknown tenant</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search by tenant or reference..." 
                            className="pl-10 h-10 bg-card"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterMethod} onValueChange={setFilterMethod}>
                        <SelectTrigger className="w-[180px] h-10 bg-card">
                            <SelectValue placeholder="Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Methods</SelectItem>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="banktransfer">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.map((payment) => (
                                <TableRow key={payment.id} className="hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{payment.date}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{payment.tenant}</div>
                                        <div className="text-xs text-muted-foreground">Unit {payment.unit}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {payment.method === 'Mpesa' ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">M-Pesa</Badge>
                                            ) : payment.method === 'Bank Transfer' ? (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Bank</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cash</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{payment.reference}</TableCell>
                                    <TableCell className="text-right font-bold">KES {payment.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Payments;