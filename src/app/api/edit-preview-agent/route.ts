// File: app/api/modifyCSS/route.ts
// Change: Incorporate structured outputs for the response

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export async function POST(request: Request) {
  try {
    const { originalCSS, prompt } = await request.json();
    console.log('Request received:', { originalCSS, prompt });

    if (!originalCSS || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Making OpenAI request...');
    const response = await openai.responses.create({
      model: 'o3-mini', // or whichever structured-output-capable model you have
      input: [
        {
          role: 'system',
          content: `You are a CSS expert. You will receive current CSS and a user request for changes.
Your job: produce a structured JSON array. Each item has:
"className" (the selector) and "content" (the CSS properties to go inside curly braces).
No curly braces, just the properties. No extra keys or explanations. Strictly follow the schema.`
        },
        {
          role: 'user',
          content: `Current CSS:\n${originalCSS}\n\nRequested changes:\n${prompt}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "css_modifications",
          schema: {
            type: "object",
            properties: {
              modifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    className: { type: "string" },
                    content: { type: "string" }
                  },
                  required: ["className", "content"],
                  additionalProperties: false
                }
              }
            },
            required: ["modifications"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    console.log('OpenAI raw response:', response);

    // response.output_text should be valid JSON that matches our schema
    if (!response.output_text) {
      console.log('No output_text in response');
      throw new Error('No output from the model');
    }

    console.log('Response output_text:', response.output_text);

    // Attempt to parse
    const modifications = JSON.parse(response.output_text);
    console.log('Parsed modifications:', modifications);

    // Return the final array
    return NextResponse.json(modifications);
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to modify CSS' },
      { status: 500 }
    );
  }
}