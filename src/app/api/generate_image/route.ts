import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import Replicate from "replicate";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

const schema = z.object({
  prompts: z.array(z.string()),
});

// Helper function to generate a prompt using OpenAI
async function generateReplicatePromptFromOpenAI(
  title: string,
  description: string,
  location: string,
  time: string
) {
  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a list highly detailed image prompts for an AI model. The prompt should describe the scene, lighting, colors, and composition to create an eye-catching promotional image. Return as a json array. Do not include code fences",
      },
      {
        role: "user",
        content: `Generate 3 AI image prompt for a promotional poster for an event with these details:
        - Title: ${title}
        - Description: ${description}
        - Location: ${location}
        - Time: ${time}
        Ensure the description is visually rich and structured for an AI model to generate an engaging, high-quality image.`,
      },
    ],
    response_format: zodResponseFormat(schema, "prompts"),
  });

  return openaiResponse;
}

export async function POST(req: Request) {
  try {
    const { title, description, location, time } = await req.json();

    if (!title || !description || !location || !time) {
      return NextResponse.json(
        { error: "Missing required event details" },
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

    if (!structuredPrompt) {
      return NextResponse.json(
        { error: "Failed to generate AI prompt" },
        { status: 500 }
      );
    }

    const unparsed = structuredPrompt.choices[0].message.content;
    if (!unparsed) {
      return NextResponse.json(
        { error: "Failed to generate AI prompt" },
        { status: 500 }
      );
    }

    console.log(unparsed);

    const data: z.infer<typeof schema> = JSON.parse(unparsed);
    const prompts = data.prompts;

    const replicateResponses = await Promise.all(
      prompts.map(async (prompt: string) => {
        return await replicate.run("black-forest-labs/flux-schnell", {
          input: {
            prompt: prompt,
            num_outputs: 3, // Generate 4 images
          },
        });
      })
    );

    let output: string[] = [];

    replicateResponses.forEach((response: object) => {
      const responseArray = response as any[];
      output = [...output, ...responseArray.map((item) => item.url().href)];
    });
    return NextResponse.json({
      imageUrl: output,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
