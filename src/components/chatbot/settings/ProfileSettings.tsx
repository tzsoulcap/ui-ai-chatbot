
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";

export const ProfileSettings = () => {
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-md font-semibold">User Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-xl font-bold text-purple-800 dark:text-purple-200">
              {username.charAt(0).toUpperCase()}
            </div>
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute bottom-0 right-0 rounded-full w-8 h-8"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={!editing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={!editing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="updates" className="cursor-pointer">Receive updates</Label>
            <Switch 
              id="updates" 
              checked={receiveUpdates} 
              onCheckedChange={setReceiveUpdates} 
            />
          </div>
        </div>
        
        {editing && (
          <Button 
            className="w-full" 
            onClick={() => setEditing(false)}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};
