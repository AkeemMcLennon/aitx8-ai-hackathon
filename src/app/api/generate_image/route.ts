import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

// Helper function to generate a prompt using OpenAI
async function generateReplicatePromptFromOpenAI(
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
					'Generate a list highly detailed image prompts for an AI model. The prompt should describe the scene, lighting, colors, and composition to create an eye-catching promotional image. Return as a json array. Do not include code fences',
			},
			{
				role: 'user',
				content: `Generate 5 AI image prompt for a promotional poster for an event with these details:
        - Title: ${title}
        - Description: ${description}
        - Location: ${location}
        - Time: ${time}
        Ensure the description is visually rich and structured for an AI model to generate an engaging, high-quality image.`,
			},
		],
	});

	return openaiResponse;
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

		// Generate AI prompt using OpenAI
		const structuredPrompt = await generateReplicatePromptFromOpenAI(
			title,
			description,
			location,
			time
		);

		const data = JSON.parse(structuredPrompt.choices[0].message.content);
		console.log('data', JSON.parse(data));
		console.log('response from openAI', structuredPrompt);
		const prompts = data.map((item) => item.prompt);

		if (!structuredPrompt) {
			return NextResponse.json(
				{ error: 'Failed to generate AI prompt' },
				{ status: 500 }
			);
		}

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

		let output = [];

		replicateResponses.forEach((response: any[]) => {
			output = [...output, response.map((item) => item.url().href)];
		});

		// // Send the structured prompt to Replicate
		// const replicateResponse = (await replicate.run(
		// 	'black-forest-labs/flux-schnell',
		// 	{
		// 		input: {
		// 			prompt: structuredPrompt,
		// 			num_outputs: 4, // Generate 4 images
		// 		},
		// 	}
		// )) as any[];

		// const imageUrl = replicateResponse.map((item) => item.url().href);
		return NextResponse.json({
			imageUrl: output,
		});
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
