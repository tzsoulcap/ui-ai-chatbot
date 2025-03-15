
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export const ControlSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [enableSound, setEnableSound] = useState(false);
  const [temperature, setTemperature] = useState([0.7]);
  const [messageHistory, setMessageHistory] = useState("50");
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the theme
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-md font-semibold">Control Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your chatbot experience
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch 
            id="dark-mode" 
            checked={darkMode} 
            onCheckedChange={toggleDarkMode} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-save">Auto-save conversations</Label>
          <Switch 
            id="auto-save" 
            checked={autoSave} 
            onCheckedChange={setAutoSave} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {enableSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <Label htmlFor="sound">Notification sounds</Label>
          </div>
          <Switch 
            id="sound" 
            checked={enableSound} 
            onCheckedChange={setEnableSound} 
          />
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature">AI Temperature: {temperature[0].toFixed(1)}</Label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onValueChange={setTemperature}
          />
          <p className="text-xs text-muted-foreground">
            Lower values produce more predictable responses, higher values more creative ones.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="history">Message History</Label>
          <Select value={messageHistory} onValueChange={setMessageHistory}>
            <SelectTrigger>
              <SelectValue placeholder="Select history limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Last 10 messages</SelectItem>
              <SelectItem value="25">Last 25 messages</SelectItem>
              <SelectItem value="50">Last 50 messages</SelectItem>
              <SelectItem value="100">Last 100 messages</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="w-full">
          Reset to Default Settings
        </Button>
      </div>
    </div>
  );
};
