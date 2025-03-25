import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EventDetails } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { usePoster } from '@/components/PosterContext';
import { useRouter } from 'next/navigation';
import { generateRandomEvent } from '@/lib/random-event';
import axios from 'axios';

const EventForm: React.FC = () => {
	const { updateEventDetails } = usePoster();
	const router = useRouter();
	const [formData, setFormData] = useState<EventDetails>({
		title: '',
		location: '',
		description: '',
		dateTime: '',
	});
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof EventDetails, string>>
	>({});
	const { toast } = useToast();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user types
		if (formErrors[name as keyof EventDetails]) {
			setFormErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleRandomize = () => {
		const randomEvent = generateRandomEvent();
		setFormData(randomEvent);
		setFormErrors({});
		toast({
			title: 'Random event generated',
			description: 'Feel free to edit the details or generate another one!',
			duration: 3000,
		});
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			updateEventDetails(formData);

			// Call the generatePromo function after validation
			try {
				const response = await axios.post('/api/generate_image', {
					title: formData.title,
					description: formData.description,
					location: formData.location,
					time: formData.dateTime,
					// Include any necessary data to send to the API
					// For example, you might want to send formData or specific fields
				});

				const imageUrl = response.data.imageUrl; // Adjust based on your API response structure
				console.log('Generated Image URL:', imageUrl);
				// You can now use the imageUrl as needed in your component
			} catch (error) {
				console.error('Error generating promo:', error);
			}

			toast({
				title: 'Event details saved',
				description: 'Now choose a background for your poster',
				duration: 3000,
			});
			router.push('/create/background');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6"
		>
			<div className="flex justify-end mb-4">
				<Button
					type="button"
					variant="outline"
					onClick={handleRandomize}
					className="group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180"
					>
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
						<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
						<path d="M16 21h5v-5" />
					</svg>
					Generate Random Event
				</Button>
			</div>

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

			<Button
				type="submit"
				className="w-full"
			>
				Continue to Background Selection
			</Button>
		</form>
	);
};

export default EventForm;
