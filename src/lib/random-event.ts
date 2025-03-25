import { EventDetails } from '@/types';

const eventTypes = [
  'Tech Meetup',
  'Music Festival',
  'Art Exhibition',
  'Food & Wine Tasting',
  'Business Conference',
  'Community Workshop',
  'Charity Gala',
  'Film Screening',
  'Fashion Show',
  'Gaming Tournament',
];

const locations = [
  'Downtown Conference Center',
  'Central Park',
  'The Grand Hotel',
  'Innovation Hub',
  'Community Arts Space',
  'City Convention Center',
  'Riverside Gardens',
  'Tech Campus',
  'Historic Theater',
  'Urban Gallery',
];

const descriptiveWords = [
  'Annual',
  'International',
  'Local',
  'Premier',
  'Exclusive',
  'Interactive',
  'Virtual',
  'Hybrid',
];

const years = ['2024', '2025'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFutureDate(): Date {
  const now = new Date();
  const futureDate = new Date(now);
  // Random date between 1 month and 6 months from now
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 150) + 30);
  return futureDate;
}

function formatDateTime(date: Date): string {
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
}

function generateDescription(eventType: string, location: string): string {
  const descriptions = [
    `Join us for an unforgettable ${eventType.toLowerCase()} experience at ${location}. Network with industry leaders, gain valuable insights, and be part of something extraordinary.`,
    `Don't miss this exciting ${eventType.toLowerCase()} happening at ${location}. Connect with like-minded individuals and create lasting memories.`,
    `Experience the magic of our ${eventType.toLowerCase()} at the stunning ${location}. Immerse yourself in a world of creativity and innovation.`,
  ];
  return getRandomElement(descriptions);
}

export function generateRandomEvent(): EventDetails {
  const eventType = getRandomElement(eventTypes);
  const location = getRandomElement(locations);
  const descriptiveWord = getRandomElement(descriptiveWords);
  const year = getRandomElement(years);
  const date = getRandomFutureDate();

  return {
    title: `${descriptiveWord} ${eventType} ${year}`,
    location: location,
    dateTime: formatDateTime(date),
    description: generateDescription(eventType, location),
  };
} 