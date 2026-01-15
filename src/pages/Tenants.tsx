import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Phone, Mail, MessageCircle, MoreVertical, FileText, AlertTriangle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { db, User } from '@/lib/store';
import ReceiptGenerator from '@/components/ReceiptGenerator';

// Helper to map DB User to UI format if needed, or use directly
const Tenants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local State for Tenants
  const [tenants, setTenants] = useState<User[]>([]);

  // Load Tenants from DB on mount
  useEffect(() => {
    const loaded = db.getTenants();
    setTenants(loaded);
  }, []);

  const isLandlord = user?.role === 'landlord';
  const filter = searchParams.get('filter');

  // Receipt Generator State
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptType, setReceiptType] = useState<'receipt' | 'vacate'>('receipt');
  const [receiptTenant, setReceiptTenant] = useState<User | null>(null);

  const openReceipt = (tenant: User, type: 'receipt' | 'vacate', e: React.MouseEvent) => {
      e.stopPropagation();
      setReceiptTenant(tenant);
      setReceiptType(type);
      setReceiptOpen(true);
  };

  // Alert Modal State
  const [alertOpen, setAlertOpen] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState<User | null>(null);
  const [alertType, setAlertType] = useState('rent');
  const [customMessage, setCustomMessage] = useState('');

  const openAlertModal = (tenant: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTenant(tenant);
    setAlertOpen(true);
    setAlertType('rent'); 
  };

  const getAlertMessage = () => {
     if (!selectedTenant) return '';
     const rent = selectedTenant.rentAmount || 0;
     const balance = selectedTenant.balance || 0;
     
     if (alertType === 'rent') {
         const currentMonth = new Date().toLocaleString('default', { month: 'long' });
         return `Hello ${selectedTenant.fullName}, kindly pay your rent of KES ${rent.toLocaleString()} for ${currentMonth} via M-Pesa. Thank you.`;
     } else if (alertType === 'arrears') {
         if (balance <= 0) {
             return "Tenant has no arrears to report.";
         }
         return `Hello ${selectedTenant.fullName}, you have an outstanding balance of KES ${balance.toLocaleString()}. Please clear this immediately to avoid penalties.`;
     } else {
         return customMessage;
     }
  };

  const handleSendAlert = () => {
    if (!selectedTenant) return;
    
    // Simulate Opening WhatsApp/SMS in real life
    const message = alertType === 'custom' ? customMessage : getAlertMessage();
    const phone = selectedTenant.phone.replace(/\s/g, '').replace('+', '');
    
    // Construct WhatsApp URL
    // Format: https://wa.me/254712345678?text=Hello...
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/254${phone.substring(1)}?text=${encodedMessage}`;
    
    // Open in new tab (Real Logic)
    window.open(waUrl, '_blank');

    toast({
        title: "WhatsApp Opened",
        description: `Message prepared for ${selectedTenant.fullName}`,
    });
    setAlertOpen(false);
  };

  const handleReportTenant = (tenant: User, e: React.MouseEvent) => {
      e.stopPropagation();
      toast({
          title: "Tenant Reported",
          description: "Report has been filed and sent to the landlord.",
      });
  };

  // Filter Logic
  let filteredTenants = tenants;

  // Derive status from balance (Simple logic for demo)
  const getStatus = (t: User) => {
      if ((t.balance || 0) > 0) return 'overdue'; // or partial
      return 'paid';
  };

  if (filter) {
      filteredTenants = filteredTenants.filter(t => getStatus(t) === filter);
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTenants = filteredTenants.filter(t =>
      t.fullName.toLowerCase().includes(query) ||
      (t.unitNumber || '').toLowerCase().includes(query) ||
      t.phone.includes(query)
    );
  }

  const handleTenantClick = (tenant: User) => {
      // In a real app we'd have a detail page
      // navigate(`/tenants/${tenant.id}`);
      toast({ title: "View Details", description: "Detail view not fully implemented in this demo step."});
  };

  const handleContact = (tenant: User) => {
    const phone = tenant.phone.replace(/\s/g, '');
    window.open(`https://wa.me/254${phone.substring(1)}`, '_blank');
  };

  return (
    <div className="mobile-container min-h-screen pb-20">
      <PageHeader
        title="Tenants"
        subtitle={filter ? `Showing ${filter} tenants` : `${filteredTenants.length} tenants`}
        rightContent={
          <Button
            size="sm"
            onClick={() => {
                // This would go to Add Tenant Page
                navigate('/add-tenant'); 
            }}
            className="h-9"
          >
            <Plus size={18} className="mr-1" />
            Add
          </Button>
        }
      />

      <div className="content-area max-w-7xl mx-auto p-4 md:p-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, unit, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card"
          />
        </div>

        {/* Desktop Table View */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[20%]">Name</TableHead>
                <TableHead className="w-[20%]">Contact</TableHead>
                <TableHead className="w-[10%]">Unit</TableHead>
                <TableHead className="w-[20%]">Rent Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => {
                const status = getStatus(tenant);
                return (
                <TableRow 
                    key={tenant.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => handleTenantClick(tenant)}
                >
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {tenant.fullName.split(' ').map(n => n[0]).join('')}
                         </div>
                         {tenant.fullName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Phone size={14} /> {tenant.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono bg-background">
                        {tenant.unitNumber || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col gap-1">
                        <span className="font-semibold">KES {(tenant.rentAmount || 0).toLocaleString()}</span>
                        {status === 'paid' ? (
                            <span className="text-xs text-success font-medium flex items-center gap-1">
                                ● Paid
                            </span>
                        ) : (
                            <span className={`text-xs font-medium flex items-center gap-1 ${status === 'overdue' ? 'text-destructive' : 'text-warning-foreground'}`}>
                                ● Bal: KES {(tenant.balance || 0).toLocaleString()}
                            </span>
                        )}
                     </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                       {/* Quick Action: Contact */}
                       <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 w-8 p-0 md:w-auto md:px-3 gap-1.5"
                            onClick={() => handleContact(tenant)}
                        >
                            <MessageCircle size={16} />
                            <span className="hidden md:inline">Contact</span>
                       </Button>

                       {/* More Actions Menu */}
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => openAlertModal(tenant, e)}>
                                    <AlertTriangle className="mr-2 h-4 w-4" /> Send Payment Alert
                                </DropdownMenuItem>
                                
                                {isLandlord && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Documents</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={(e) => openReceipt(tenant, 'receipt', e)}>
                                            <FileText className="mr-2 h-4 w-4" /> Generate Receipt
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => openReceipt(tenant, 'vacate', e)} className="text-destructive focus:text-destructive">
                                            <FileText className="mr-2 h-4 w-4" /> Vacate Notice
                                        </DropdownMenuItem>
                                    </>
                                )}
                                
                                {!isLandlord && (
                                    <DropdownMenuItem onClick={(e) => handleReportTenant(tenant, e)}>
                                         <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )})}
              {filteredTenants.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No tenants found
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* PDF Generator Modal */}
      {receiptTenant && (
        <ReceiptGenerator 
            isOpen={receiptOpen}
            onClose={() => setReceiptOpen(false)}
            tenant={receiptTenant}
            type={receiptType}
            landlordName={user?.fullName || 'Landlord'}
            propertyName={user?.propertyName || 'Property'}
        />
      )}

      {/* Alert Modal */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Send Alert to {selectedTenant?.fullName}</DialogTitle>
                <DialogDescription>
                    Choose the type of alert to send via SMS/WhatsApp.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                 <RadioGroup value={alertType} onValueChange={setAlertType}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rent" id="rent" />
                        <Label htmlFor="rent">Rent Alert (Standard)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="arrears" id="arrears" />
                        <Label htmlFor="arrears">Arrears Reminder</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom Message</Label>
                    </div>
                </RadioGroup>

                <div className="p-3 bg-muted/40 rounded-lg text-sm text-foreground/80 border">
                    {alertType === 'custom' ? (
                        <Textarea 
                            value={customMessage} 
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="bg-transparent border-0 focus-visible:ring-0 resize-none p-0 h-24"
                        />
                    ) : (
                        <p>{getAlertMessage()}</p>
                    )}
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setAlertOpen(false)}>Cancel</Button>
                <Button onClick={handleSendAlert} className="gap-2">
                    <Send size={16} />
                    Open WhatsApp
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default Tenants;
