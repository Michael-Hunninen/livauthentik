'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Lock, Bell, CreditCard, Shield, Globe, LogOut } from 'lucide-react';

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
};

type NotificationSettings = {
  emailNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  securityAlerts: boolean;
};

type SecuritySettings = {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  trustedDevices: {
    id: string;
    name: string;
    lastUsed: string;
    location: string;
  }[];
};

type BillingInfo = {
  cardType: string;
  lastFour: string;
  expiryDate: string;
  nameOnCard: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Wellness enthusiast and health coach. Love exploring new ways to improve mind and body balance.'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    securityAlerts: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: true,
    loginAlerts: true,
    trustedDevices: [
      {
        id: '1',
        name: 'MacBook Pro 16\"',
        lastUsed: '2 hours ago',
        location: 'Chicago, IL'
      },
      {
        id: '2',
        name: 'iPhone 14 Pro',
        lastUsed: '30 minutes ago',
        location: 'Chicago, IL'
      }
    ]
  });

  const [billing, setBilling] = useState<BillingInfo>({
    cardType: 'Visa',
    lastFour: '4242',
    expiryDate: '04/26',
    nameOnCard: 'Alex Johnson'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key: keyof Omit<SecuritySettings, 'trustedDevices'>, value: boolean) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Settings saved',
      description: 'Your changes have been saved successfully.',
    });
    
    setIsSaving(false);
  };

  const handleSignOut = () => {
    // Add sign out logic here
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-accent/20">
                  <AvatarImage src={profile.avatar} alt={profile.firstName} />
                  <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-medium">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-sm text-muted-foreground">Premium Member</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:bg-accent/5'}`}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:bg-accent/5'}`}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:bg-accent/5'}`}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:bg-accent/5'}`}
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Billing
                </button>
                <Separator className="my-2" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-destructive/5 hover:text-destructive rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="border-0 bg-background/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-medium">
                    {activeTab === 'profile' && 'Profile Settings'}
                    {activeTab === 'notifications' && 'Notification Preferences'}
                    {activeTab === 'security' && 'Security Settings'}
                    {activeTab === 'billing' && 'Billing Information'}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'profile' && 'Update your personal information and preferences'}
                    {activeTab === 'notifications' && 'Manage how you receive notifications'}
                    {activeTab === 'security' && 'Enhance your account security'}
                    {activeTab === 'billing' && 'Manage your payment methods and billing information'}
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent/90 transition-colors"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-accent/20">
                        <AvatarImage src={profile.avatar} alt={profile.firstName} />
                        <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-sm font-medium">Change</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 text-accent">
                      Update photo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="mt-1 pl-10"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={handleProfileChange}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Tell us a little bit about yourself</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Email Notifications</CardTitle>
                      <CardDescription>Manage when you'll be notified via email</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive email notifications</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                        </div>
                        <Switch
                          id="marketing-emails"
                          checked={notifications.marketingEmails}
                          onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="order-updates">Order Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about your order status</p>
                        </div>
                        <Switch
                          id="order-updates"
                          checked={notifications.orderUpdates}
                          onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security-alerts">Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive important security notifications</p>
                        </div>
                        <Switch
                          id="security-alerts"
                          checked={notifications.securityAlerts}
                          onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Security Settings</CardTitle>
                      <CardDescription>Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch
                          id="two-factor"
                          checked={security.twoFactorAuth}
                          onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="login-alerts">Login Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified when there's a new login from an unrecognized device</p>
                        </div>
                        <Switch
                          id="login-alerts"
                          checked={security.loginAlerts}
                          onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Trusted Devices</CardTitle>
                      <CardDescription>Manage devices that have access to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {security.trustedDevices.map((device) => (
                          <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-full bg-accent/10">
                                {device.name.includes('iPhone') ? (
                                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{device.name}</p>
                                <p className="text-sm text-muted-foreground">{device.location} • Last used {device.lastUsed}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Payment Methods</CardTitle>
                      <CardDescription>Manage your saved payment methods</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              {billing.cardType === 'Visa' ? (
                                <svg className="w-8 h-5" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.6 0.5L6.9 14.5H10.5L13.2 0.5H9.6Z" fill="#1A1F71"/>
                                  <path d="M21.8 0.5L17.4 10.1L16.8 7.6L16.7 7.3C16.2 5.7 15 4.1 13.2 3.1L15.7 14.6H19.3L24 0.5H21.8Z" fill="#1A1F71"/>
                                  <path d="M14.4 0.5H10.8L10.9 1.1C13.2 1.6 15 3 15.8 4.9L14.4 0.5Z" fill="#F2AE14"/>
                                  <path d="M9.6 0.5L6.9 14.5H10.5L13.2 0.5H9.6Z" fill="#F69E1E"/>
                                  <path d="M0 0.5L0 0.6C3.6 1.8 5.9 4.5 6.7 7.8L7.6 2.2C7.8 1.1 8.4 0.5 9 0.5H0Z" fill="#F69E1E"/>
                                  <path d="M16.7 7.3L16.8 7.6L17.4 10.1L21.8 0.5H24C22.9 0.5 21.9 1.1 21.5 2.1L17.7 10.1L16.7 7.3Z" fill="#F2AE14"/>
                                </svg>
                              ) : (
                                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z" fill="#ED0006"/>
                                  <path d="M35 0C33.3 0 31.8 0.7 31 1.9C30.2 0.7 28.7 0 27 0H35Z" fill="#F9A000"/>
                                  <path d="M31 1.9C30.2 0.7 28.7 0 27 0H35V6H31V1.9Z" fill="#FF5C00"/>
                                  <path d="M31 6V1.9C30.2 0.7 28.7 0 27 0V6H31Z" fill="#F9A000"/>
                                  <path d="M27 0H35C33.3 0 31.8 0.7 31 1.9V6H27V0Z" fill="#FF5C00"/>
                                  <path d="M35 0C36.7 0 38 1.3 38 3V6H31V1.9C31.8 0.7 33.3 0 35 0Z" fill="#F9A000"/>
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{billing.cardType} •••• {billing.lastFour}</p>
                              <p className="text-sm text-muted-foreground">Expires {billing.expiryDate} • {billing.nameOnCard}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-4 text-accent">
                        + Add Payment Method
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Billing History</CardTitle>
                      <CardDescription>View your past invoices and payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">Premium Membership</p>
                            <p className="text-sm text-muted-foreground">May 15, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$29.99</p>
                            <p className="text-sm text-muted-foreground">Paid</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">Product Purchase</p>
                            <p className="text-sm text-muted-foreground">April 28, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$87.50</p>
                            <p className="text-sm text-muted-foreground">Paid</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-4 text-accent">
                        View All Invoices
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
