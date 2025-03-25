import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

// Helper function to generate a prompt using OpenAI
async function generateOpenAIPrompt(
	title: string,
	description: string,
	location: string,
	time: string
) {
	const openaiResponse = await openai.chat.completions.create({
		model: 'gpt-4-turbo',
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

	return openaiResponse.choices.map((choice) => choice.message?.content);
}

// Helper function to send the structured prompt to Replicate
async function generateImagesFromReplicate(prompts: string[]) {
	const replicateResponses = await Promise.all(
		prompts.map(async (prompt) => {
			return await replicate.run('black-forest-labs/flux-schnell', {
				input: {
					prompt: prompt,
					num_outputs: 4, // Generate 4 images
				},
			});
		})
	);

	// Flatten the array of responses and extract image URLs
	return replicateResponses.flat().map((response) => response.url().href);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const { title, description, location, time } = req.body;

		if (!title || !description || !location || !time) {
			return res.status(400).json({ error: 'Missing required event details' });
		}

		try {
			// Call the helper function to generate the prompts
			const structuredPrompts = await generateOpenAIPrompt(
				title,
				description,
				location,
				time
			);

			if (!structuredPrompts.length) {
				return res.status(500).json({ error: 'Failed to generate AI prompts' });
			}

			// Filter out null values from structuredPrompts
			const validPrompts = structuredPrompts.filter(
				(prompt): prompt is string => prompt !== null
			);

			// Call the helper function to generate images from Replicate
			const imageUrls = await generateImagesFromReplicate(validPrompts);

			return res.status(200).json({ imageUrls });
		} catch (error) {
			console.error('Error:', error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
