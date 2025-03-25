import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import Replicate from "replicate";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

const schema = z.object({
  prompts: z.array(
    z.object({
      theme: z.string(),
      visuals: z.string(),
      textLayout: z.string(),
    })
  ),
});

// Helper function to calculate image dimensions based on aspect ratio
function getImageDimensions(aspectRatio: string): { width: number; height: number } {
  const [width, height] = aspectRatio.split(':').map(Number);
  const baseSize = 1024; // Base size for the larger dimension
  
  if (width >= height) {
    return {
      width: baseSize,
      height: Math.round((height / width) * baseSize)
    };
  } else {
    return {
      width: Math.round((width / height) * baseSize),
      height: baseSize
    };
  }
}

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
          "Generate a list highly detailed image prompts for an AI model. The prompt should describe the scene, lighting, colors, and composition to create an eye-catching promotional image. Do not include text in the prompt.",
      },
      {
        role: "user",
        content: `Generate 3 AI image prompts for a promotional poster for an event with these details:
        - Title: ${title}
        - Description: ${description}
        - Location: ${location}
        - Time: ${time}
        Ensure the description is visually rich and structured for an AI model to generate an engaging, high-quality image. Make sure there is no text in the final image.
        
        `,
      },
    ],
    response_format: zodResponseFormat(schema, "prompts"),
  });

  return openaiResponse;
}

export async function POST(req: Request) {
  try {
    const { title, description, location, time, aspectRatio = '4:5' } = await req.json();

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

    // Calculate image dimensions based on aspect ratio
    const dimensions = getImageDimensions(aspectRatio);

    const replicateResponses = await Promise.all(
      prompts.map(async (prompt: typeof data.prompts[0]) => {
        return await replicate.run("black-forest-labs/flux-schnell", {
          input: {
            prompt: `No text unless explicitly stated. ${prompt.theme} ${prompt.visuals}`,
            num_outputs: 3,
            width: dimensions.width,
            height: dimensions.height,
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
