import { useState, useEffect } from 'react';
import { Building2, Users, Plus, Upload, MapPin, Wallet, Banknote, UserPlus, Phone, History, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Property {
    id: number;
    name: string;
    location: string;
    units: string;
    logo: string | null;
    active: boolean;
}

interface Caretaker {
    id: number;
    name: string;
    phone: string;
    assignedTo: string;
    status: 'Active' | 'Inactive';
    joined: string;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // --- STATE MANAGEMENT ---
  const [properties, setProperties] = useState<Property[]>(() => {
      const saved = localStorage.getItem('p3l_properties');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Sunrise Apartments', location: 'Kileleshwa, Nairobi', units: '30', logo: null, active: true },
        { id: 2, name: 'Sunset Villas', location: 'Westlands, Nairobi', units: '12', logo: null, active: false }
      ];
  });
  
  const [caretakers, setCaretakers] = useState<Caretaker[]>(() => {
      const saved = localStorage.getItem('p3l_caretakers');
      return saved ? JSON.parse(saved) : [
         { id: 1, name: 'John Kamau', phone: '0712 345 678', assignedTo: 'Sunrise Apartments', status: 'Active', joined: 'Jan 2024' },
      ];
  });

  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  // Form States
  const [propName, setPropName] = useState('');
  const [propLoc, setPropLoc] = useState('');
  const [propUnits, setPropUnits] = useState('');

  // --- PERSISTENCE ---
  useEffect(() => {
      localStorage.setItem('p3l_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
      localStorage.setItem('p3l_caretakers', JSON.stringify(caretakers));
  }, [caretakers]);

  // --- HANDLERS ---

  const handleOpenPropertyDialog = (property?: Property) => {
      if (property) {
          setEditingProperty(property);
          setPropName(property.name);
          setPropLoc(property.location);
          setPropUnits(property.units);
      } else {
          setEditingProperty(null);
          setPropName('');
          setPropLoc('');
          setPropUnits('');
      }
      setIsPropertyDialogOpen(true);
  };

  const handleSaveProperty = () => {
      if (!propName || !propLoc) {
          toast({ title: "Error", description: "Name and Location are required.", variant: "destructive" });
          return;
      }

      if (editingProperty) {
          // Edit Mode
          setProperties(prev => prev.map(p => 
              p.id === editingProperty.id 
              ? { ...p, name: propName, location: propLoc, units: propUnits }
              : p
          ));
          toast({ title: "Property Updated", description: `${propName} has been updated.` });
      } else {
          // Add Mode
          const newProp: Property = {
              id: Date.now(),
              name: propName,
              location: propLoc,
              units: propUnits || '0',
              logo: null,
              active: false
          };
          setProperties(prev => [...prev, newProp]);
          toast({ title: "Property Added", description: `${propName} has been created.` });
      }
      setIsPropertyDialogOpen(false);
  };

  const handleSwitchProperty = (id: number) => {
      setProperties(prev => prev.map(p => ({
          ...p,
          active: p.id === id
      })));
      toast({ title: "Switched Property", description: "Dashboard is now showing data for selected property." });
  };

  const activeProperty = properties.find(p => p.active);

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <PageHeader 
        title="Property Configuration" 
        subtitle={`Viewing: ${activeProperty?.name || 'All Properties'}`}
      />

      <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
                    <DialogDescription>
                        Enter the details of your apartment building.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={propName} onChange={e => setPropName(e.target.value)} className="col-span-3" placeholder="e.g. Sunrise Apts" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">Location</Label>
                        <Input id="location" value={propLoc} onChange={e => setPropLoc(e.target.value)} className="col-span-3" placeholder="e.g. Nairobi" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="units" className="text-right">Total Units</Label>
                        <Input id="units" type="number" value={propUnits} onChange={e => setPropUnits(e.target.value)} className="col-span-3" placeholder="e.g. 20" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveProperty}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Tabs defaultValue="properties" className="space-y-6">
          <div className="bg-card rounded-lg shadow-sm border p-2 overflow-x-auto">
            <TabsList className="w-full justify-start bg-transparent h-auto p-0 space-x-2">
              <TabsTrigger value="properties" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 h-auto gap-2">
                <Building2 size={16} /> Properties
              </TabsTrigger>
              <TabsTrigger value="finance" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 h-auto gap-2">
                <Wallet size={16} /> Payment Methods
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 h-auto gap-2">
                <Users size={16} /> Caretakers
              </TabsTrigger>
            </TabsList>
          </div>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">My Apartments</h3>
                <Button className="gap-2" onClick={() => handleOpenPropertyDialog()}><Plus size={16} /> Add Property</Button>
            </div>

            <div className="grid gap-6">
                {properties.map(property => (
                    <Card key={property.id} className={property.active ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'opacity-80'}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative group cursor-pointer overflow-hidden">
                                        {property.logo ? (
                                            <img src="/placeholder-logo.png" className="w-full h-full object-cover" alt="logo" />
                                        ) : (
                                            <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{property.name}</CardTitle>
                                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                            <MapPin size={14} />
                                            {property.location}
                                        </div>
                                    </div>
                                </div>
                                {property.active ? (
                                    <Badge variant="default" className="bg-primary text-primary-foreground">Active</Badge>
                                ) : (
                                    <Button size="sm" variant="secondary" onClick={() => handleSwitchProperty(property.id)}>Switch to this</Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-2 gap-4 text-sm">
                                 <div className="bg-muted/50 p-3 rounded-md">
                                     <span className="text-muted-foreground block text-xs uppercase">Total Units</span>
                                     <span className="font-semibold text-lg">{property.units}</span>
                                 </div>
                                 <div className="bg-muted/50 p-3 rounded-md">
                                     <span className="text-muted-foreground block text-xs uppercase">Occupancy</span>
                                     <span className="font-semibold text-lg">80%</span>
                                 </div>
                             </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-4">
                            <Button variant="outline" size="sm" onClick={() => handleOpenPropertyDialog(property)}>
                                <Edit2 size={14} className="mr-2"/> Edit Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          </TabsContent>

          {/* FINANCE TAB */}
          <TabsContent value="finance" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Channels</CardTitle>
                    <CardDescription>Configure how tenants can pay rent. These details appear on invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* M-Pesa */}
                    <div className="flex items-start gap-4 p-4 border rounded-lg bg-emerald-50/50 border-emerald-100">
                        <div className="p-2 bg-emerald-100 rounded text-emerald-700 mt-1">
                            <Phone size={20} />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">M-Pesa (Mobile Money)</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Paybill Number</Label>
                                    <Input defaultValue="247247" className="h-9" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Account Name</Label>
                                    <Input defaultValue="Sunrise Apts" className="h-9" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank */}
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded text-blue-700 mt-1">
                            <Building2 size={20} />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Bank Transfer</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Bank Name</Label>
                                    <Input defaultValue="Equity Bank" className="h-9" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Account Number</Label>
                                    <Input defaultValue="1234 5678 9000" className="h-9" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cash */}
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-orange-100 rounded text-orange-700">
                            <Banknote size={20} />
                        </div>
                        <div className="flex-1">
                             <Label className="text-base font-semibold">Cash Payments</Label>
                             <p className="text-sm text-muted-foreground">Allow caretakers to collect cash and record it manually.</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                    <Button>Save Payment Settings</Button>
                </CardFooter>
            </Card>
          </TabsContent>

          {/* CARETAKERS TAB */}
          <TabsContent value="team">
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Current Caretaker</CardTitle>
                            <CardDescription>The person currently managing <strong>{activeProperty?.name}</strong></CardDescription>
                        </div>
                        <Button variant="secondary" size="sm" className="gap-2">
                             <History size={14} /> View History
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {caretakers.filter(c => c.assignedTo === activeProperty?.name).length > 0 ? (
                        caretakers.filter(c => c.assignedTo === activeProperty?.name).map(caretaker => (
                            <div key={caretaker.id} className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/30 rounded-lg border">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${caretaker.name}`} />
                                    <AvatarFallback>JK</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h4 className="text-lg font-bold">{caretaker.name}</h4>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Phone size={14} /> {caretaker.phone}</span>
                                        <span className="flex items-center gap-1"><Building2 size={14} /> Assigned: {caretaker.joined}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                                    <Button>Edit Access</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-lg">
                            <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                            <p>No caretaker assigned to this property.</p>
                         </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Invite New Caretaker</CardTitle>
                    <CardDescription>Grant access to a new staff member.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                         <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="e.g. Samuel Ochieng" />
                         </div>
                         <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="07..." />
                         </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                     <Button className="w-full md:w-auto gap-2">
                        <UserPlus size={16} /> Send Invitation
                     </Button>
                </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
