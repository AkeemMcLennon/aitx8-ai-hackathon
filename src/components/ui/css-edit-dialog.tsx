'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ModifiedCSS {
  modifications: Array<{
    className: string;
    content: string;
  }>;
}

interface CSSEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalCSS: string;
  onApplyChanges: (modifications: ModifiedCSS) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function CSSEditDialog({
  isOpen,
  onClose,
  originalCSS,
  onApplyChanges,
  onUndo,
  canUndo,
}: CSSEditDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modifiedCSS, setModifiedCSS] = useState<ModifiedCSS | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setModifiedCSS(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!prompt) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt for the CSS modification',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      console.log('Sending request to:', `${origin}/api/edit-preview-agent`);
      const response = await fetch(`${origin}/api/edit-preview-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalCSS,
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to modify CSS');
      }

      const data = await response.json();
      console.log('Received data:', data);
      setModifiedCSS(data);
      toast({
        title: 'Success',
        description: 'CSS modifications generated successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to modify CSS. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (modifiedCSS) {
      onApplyChanges(modifiedCSS);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit CSS with AI</DialogTitle>
          <DialogDescription>
            Enter a prompt to modify the CSS styles. The AI will generate new styles based on your request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              What would you like to change?
            </label>
            <Input
              id="prompt"
              placeholder="e.g., make the text bigger and bolder"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-describedby="prompt-description"
            />
            <p id="prompt-description" className="text-sm text-gray-500">
              Describe how you want to modify the CSS styles.
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Current CSS</label>
            <Textarea
              readOnly
              value={originalCSS}
              className="font-mono text-sm h-48"
              aria-label="Current CSS styles"
            />
          </div>

          {modifiedCSS && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Modified CSS</label>
              <Textarea
                readOnly
                value={modifiedCSS.modifications.map(mod => `${mod.className} {\n  ${mod.content}\n}`).join('\n\n')}
                className="font-mono text-sm h-48"
                aria-label="Modified CSS styles"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {canUndo && (
            <Button variant="outline" onClick={onUndo}>
              Undo
            </Button>
          )}
          {modifiedCSS ? (
            <Button onClick={handleApply}>Apply Changes</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 