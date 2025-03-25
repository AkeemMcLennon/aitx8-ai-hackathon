'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

export default function FormPage() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    time: '',
  });
  
  // Using a gray placeholder as the initial image
  const [imagePreview, setImagePreview] = useState('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsaWNrIHRvIHVwbG9hZCBpbWFnZTwvdGV4dD48L3N2Zz4=');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, image: imagePreview });
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Create New Entry</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Image upload */}
            <div className="w-full md:w-1/2">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="aspect-w-16 aspect-h-9 relative h-[300px] overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="object-contain"
                    fill
                    priority
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700
                             hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Form inputs */}
            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                           p-2 border"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                           p-2 border"
                  placeholder="Enter location"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="datetime-local"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                           p-2 border"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent 
                       shadow-sm text-sm font-medium rounded-md text-white 
                       bg-blue-600 hover:bg-blue-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 