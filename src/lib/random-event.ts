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
  
  // Add random days (between 7 and 180 days from now)
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 173) + 7);
  
  // Set random hour (between 9 AM and 9 PM)
  futureDate.setHours(Math.floor(Math.random() * 12) + 9, 0, 0);
  
  return futureDate;
}

function generateDescription(eventType: string, location: string): string {
  const descriptions = [
    `Join us for an unforgettable ${eventType.toLowerCase()} experience at ${location}. Network with industry leaders, gain valuable insights, and be part of this transformative event.`,
    `Experience the magic of ${eventType.toLowerCase()} like never before at ${location}. This event promises to deliver an exceptional blend of innovation and entertainment.`,
    `Don't miss this extraordinary ${eventType.toLowerCase()} at the prestigious ${location}. Connect with fellow enthusiasts and immerse yourself in an atmosphere of creativity and excellence.`,
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
    dateTime: date.toISOString().slice(0, 16), // Format as YYYY-MM-DDTHH:mm
    description: generateDescription(eventType, location),
  };
} 