import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Replicate from 'replicate';

interface ReplicateOutput {
	url: string;
}

// Helper function to generate a prompt using OpenAI
async function generateOpenAIPrompt(
	title: string,
	description: string,
	location: string,
	time: string
) {
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content:
					'Generate a highly detailed image prompt for an AI model. The prompt should describe the scene, lighting, colors, and composition to create an eye-catching promotional image.',
			},
			{
				role: 'user',
				content: `Generate an AI image prompt for a promotional poster for an event with these details:
        - Title: ${title}
        - Description: ${description}
        - Location: ${location}
        - Time: ${time}
        Ensure the description is visually rich and structured for an AI model to generate an engaging, high-quality image.`,
			},
		],
	});

	return response.choices.map((choice) => choice.message?.content);
}

// Helper function to send the structured prompt to Replicate
async function generateImagesFromReplicate(prompts: string[]) {
	const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });
	const replicateResponses = await Promise.all(
		prompts.map(async (prompt) => {
			const response = await replicate.run('black-forest-labs/flux-schnell', {
				input: {
					prompt: prompt,
					num_outputs: 4, // Generate 4 images
				},
			});
			return response as ReplicateOutput[];
		})
	);

	// Flatten the array of responses and extract image URLs
	return replicateResponses.flat().map((response) => response.url);
}

export async function POST(req: Request) {
	try {
		const { title, description, location, time } = await req.json();

		if (!title || !description || !location || !time) {
			return NextResponse.json(
				{ error: 'Missing required event details' },
				{ status: 400 }
			);
		}

		// Call the helper function to generate the prompts
		const structuredPrompts = await generateOpenAIPrompt(
			title,
			description,
			location,
			time
		);

		if (!structuredPrompts.length) {
			return NextResponse.json(
				{ error: 'Failed to generate AI prompts' },
				{ status: 500 }
			);
		}

		// Filter out null values from structuredPrompts
		const validPrompts = structuredPrompts.filter(
			(prompt): prompt is string => prompt !== null
		);

		// Call the helper function to generate images from Replicate
		const imageUrls = await generateImagesFromReplicate(validPrompts);

		return NextResponse.json({ imageUrls });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

export const dynamic = 'force-dynamic';
