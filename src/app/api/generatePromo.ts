import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

type Data = {
	imageUrl?: string;
	error?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const { title, description, location, time } = req.body as {
		title: string;
		description: string;
		location: string;
		time: string;
	};

	if (!title || !description || !location || !time) {
		return res.status(400).json({ error: 'Missing required event details' });
	}

	try {
		// Generate a structured prompt using OpenAI
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

		const structuredPrompt = openaiResponse.choices[0].message?.content;

		if (!structuredPrompt) {
			return res.status(500).json({ error: 'Failed to generate AI prompt' });
		}

		// Send the structured prompt to Replicate
		const replicateResponse = await replicate.run(
			'stability-ai/stable-diffusion',
			{
				input: { prompt: structuredPrompt },
			}
		);

		return res
			.status(200)
			.json({ imageUrl: replicateResponse as unknown as string });
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}
