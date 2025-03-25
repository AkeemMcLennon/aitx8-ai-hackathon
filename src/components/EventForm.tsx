import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EventDetails } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { usePoster } from '@/components/PosterContext';
import { useRouter } from 'next/navigation';

const EventForm: React.FC = () => {
  const { updateEventDetails } = usePoster();
  const router = useRouter();
  const [formData, setFormData] = useState<EventDetails>({
    title: '',
    location: '',
    description: '',
    dateTime: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EventDetails, string>>>({});
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (formErrors[name as keyof EventDetails]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof EventDetails, string>> = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.dateTime.trim()) {
      errors.dateTime = 'Date and time are required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      updateEventDetails(formData);
      toast({
        title: 'Event details saved',
        description: 'Now choose a background for your poster',
        duration: 3000,
      });
      router.push('/create/background');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className={formErrors.title ? 'border-red-500' : ''}
          />
          {formErrors.title && (
            <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            className={formErrors.location ? 'border-red-500' : ''}
          />
          {formErrors.location && (
            <p className="text-sm text-red-500 mt-1">{formErrors.location}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dateTime">Date & Time</Label>
          <Input
            id="dateTime"
            name="dateTime"
            type="datetime-local"
            value={formData.dateTime}
            onChange={handleChange}
            className={formErrors.dateTime ? 'border-red-500' : ''}
          />
          {formErrors.dateTime && (
            <p className="text-sm text-red-500 mt-1">{formErrors.dateTime}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continue to Background Selection
      </Button>
    </form>
  );
};

export default EventForm; 