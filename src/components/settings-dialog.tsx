'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Separator } from './ui/separator';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the application to your liking.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className='space-y-2'>
                <h4 className='font-medium text-sm'>Theme</h4>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setTheme('light')} className="flex-1">
                        <Sun className="mr-2 h-4 w-4" /> Light
                    </Button>
                    <Button variant="outline" onClick={() => setTheme('dark')} className="flex-1">
                        <Moon className="mr-2 h-4 w-4" /> Dark
                    </Button>
                    <Button variant="outline" onClick={() => setTheme('system')} className="flex-1">
                        <Monitor className="mr-2 h-4 w-4" /> System
                    </Button>
                </div>
            </div>
            <Separator />
             <div className='space-y-2 text-center text-sm text-muted-foreground'>
                <p>Made with ❤️ by Daksh Srivastava</p>
             </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
