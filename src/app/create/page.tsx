'use client';

import Header from '@/components/layout/Header';
import EventForm from '@/components/EventForm';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="page-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">
              Create Your Event Poster
            </h1>
            <p className="text-gray-600">
              Fill in your event details below to get started.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <EventForm />
          </div>
        </div>
      </main>
    </div>
  );
} 