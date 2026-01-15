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
import { Search, Plus, Filter, Wrench, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock Maintenance Data
const mockRequests = [
  { id: 'REQ-001', date: '2023-11-28', tenant: 'James Omondi', unit: 'A2', issue: 'Leaking Sink', priority: 'high', status: 'open', assignedTo: 'Unassigned' },
  { id: 'REQ-002', date: '2023-11-27', tenant: 'Grace Akinyi', unit: 'A3', issue: 'Burnt Socket', priority: 'medium', status: 'in-progress', assignedTo: 'Mike Electrician' },
  { id: 'REQ-003', date: '2023-11-25', tenant: 'Sarah Atieno', unit: 'C1', issue: 'Door Handle Broken', priority: 'low', status: 'resolved', assignedTo: 'John Carpenter' },
  { id: 'REQ-004', date: '2023-11-20', tenant: 'Lucy Njeri', unit: 'B2', issue: 'Window Jammed', priority: 'low', status: 'resolved', assignedTo: 'John Carpenter' },
  { id: 'REQ-005', date: '2023-11-15', tenant: 'David Mwangi', unit: 'B3', issue: 'No Water Pressure', priority: 'high', status: 'resolved', assignedTo: 'City Water' },
];

const Maintenance = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredRequests = mockRequests.filter(req => {
        const matchesSearch = 
            req.issue.toLowerCase().includes(searchQuery.toLowerCase()) || 
            req.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.unit.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case 'high': return 'bg-destructive text-destructive-foreground';
            case 'medium': return 'bg-orange-500 text-white';
            case 'low': return 'bg-blue-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'open': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'in-progress': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'resolved': return 'bg-success/10 text-success border-success/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-12">
            <div className="bg-background border-b px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Maintenance</h1>
                        <p className="text-muted-foreground mt-1">Manage repairs and tenant requests</p>
                    </div>
                     <div className="flex gap-3">
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus size={18} />
                            New Request
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">1</div>
                            <p className="text-xs text-muted-foreground">Needs attention immediately</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">Assigned to contractors</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved (Nov)</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">3</div>
                            <p className="text-xs text-muted-foreground">Completed this month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search requests..." 
                            className="pl-10 h-10 bg-card"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px] h-10 bg-card">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Issue</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((req) => (
                                <TableRow key={req.id} className="cursor-pointer hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{req.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{req.issue}</div>
                                        <div className="text-xs text-muted-foreground">Reported on {req.date}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{req.tenant}</div>
                                        <div className="text-xs text-muted-foreground">Unit {req.unit}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`hover:opacity-90 ${getPriorityColor(req.priority)}`}>
                                            {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        {req.assignedTo !== 'Unassigned' ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                        {req.assignedTo.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{req.assignedTo}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={getStatusColor(req.status)}>
                                            {req.status === 'in-progress' ? 'In Progress' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
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

export default Maintenance;