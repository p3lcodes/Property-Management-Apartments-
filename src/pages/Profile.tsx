import { useNavigate } from 'react-router-dom';
import { User, Phone, Building2, LogOut, Shield, KeyRound, Bell, Mail, Hotel, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
        <div className="bg-primary pb-24 pt-12 px-8">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-primary-foreground">
                <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder-profile.jpg" />
                    <AvatarFallback className="text-3xl font-bold bg-white text-primary">
                        {user?.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold">{user?.fullName}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                         <Badge variant="secondary" className="capitalize px-3 py-1">
                            {user?.role}
                         </Badge>
                         <span className="text-sm opacity-80 flex items-center gap-1">
                            <Shield size={14} /> ID: 8829103
                         </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-16">
            <Tabs defaultValue="account" className="space-y-6">
                <div className="bg-card rounded-lg shadow-sm border p-2 overflow-x-auto">
                    <TabsList className="w-full justify-start bg-transparent h-auto p-0 space-x-2">
                        <TabsTrigger value="account" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2">
                            Personal Details
                        </TabsTrigger>
                         {user?.role === 'landlord' && (
                            <TabsTrigger value="branding" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2">
                                Company Branding
                            </TabsTrigger>
                        )}
                        <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2">
                            Security & Notifications
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your contact details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="fullname" defaultValue={user?.fullName} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" defaultValue={user?.phone} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" defaultValue="admin@p3l.com" className="pl-9" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="branding">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Settings</CardTitle>
                            <CardDescription>Customize how your property appears to tenants on invoices.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                                    <div className="text-center p-2">
                                        <Building2 className="mx-auto h-8 w-8 text-muted-foreground mb-1" />
                                        <span className="text-xs text-muted-foreground">Upload Logo</span>
                                    </div>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label>Property Name</Label>
                                    <Input defaultValue="Sunrise Apartments" />
                                    <p className="text-xs text-muted-foreground">This name will appear on all generated receipts.</p>
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter className="border-t px-6 py-4">
                            <Button>Update Branding</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                     <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Authentication</CardTitle>
                                <CardDescription>Manage how you access your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            <KeyRound size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium">Change PIN</p>
                                            <p className="text-sm text-muted-foreground gap-1">
                                                Last changed 30 days ago
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Update</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Control what alerts you receive.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Payment Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Receive SMS when rent is paid</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Daily Reports</Label>
                                        <p className="text-sm text-muted-foreground">Email summary at 6:00 PM</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                     </div>
                </TabsContent>
            </Tabs>

            <div className="mt-8 flex flex-col items-center gap-4">
                 <Button onClick={handleLogout} variant="destructive" className="w-full md:w-auto gap-2">
                    <LogOut size={18} />
                    Sign Out of Account
                 </Button>

                 <div className="text-center pt-8 pb-8">
                     <p className="text-sm font-semibold text-primary">
                        &copy; P3L Property Management System | All rights reserved.
                     </p>
                     <p className="text-xs text-muted-foreground mt-1">
                        Developed and Maintained by P3L Developers, Nairobi.
                     </p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;
