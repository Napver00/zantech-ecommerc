import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';

const AccountDetails = () => {
    const { user } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <User className="h-6 w-6 text-blue-600" />
        Account Details
      </h2>
      <form className="space-y-6 max-w-lg">
        <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.name} className="mt-2" />
        </div>
         <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user.email} className="mt-2" />
        </div>
        <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue={user.phone} className="mt-2" />
        </div>
        <fieldset className="border border-gray-200 p-4 rounded-lg">
            <legend className="text-lg font-semibold px-2">Password change</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <Label htmlFor="current_password">Current password (leave blank to leave unchanged)</Label>
                    <Input id="current_password" type="password" className="mt-2"/>
                </div>
                 <div>
                    <Label htmlFor="new_password">New password (leave blank to leave unchanged)</Label>
                    <Input id="new_password" type="password" className="mt-2"/>
                </div>
                 <div>
                    <Label htmlFor="confirm_password">Confirm new password</Label>
                    <Input id="confirm_password" type="password" className="mt-2"/>
                </div>
            </div>
        </fieldset>
        <div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Save changes</Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;

