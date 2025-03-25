import OpenAI from 'openai';
import * as fs from 'fs/promises';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export class OpenAIService {
    static async compareMultipleImages(imagePaths) {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORGANIZATION
        });

        try {
            const imageBuffers = await Promise.all(
                imagePaths.map(path => fs.readFile(path))
            );

            const base64Images = imageBuffers.map(buffer => 
                buffer.toString('base64')
            );

            const response = await openai.chat.completions.create({
                model: process.env.VISION_MODEL || 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Compare these two screenshots and describe any visual differences you notice. Focus on changes in colors, shapes, positions, or any other visual elements.'
                            },
                            ...base64Images.map(image => ({
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/png;base64,${image}`
                                }
                            }))
                        ]
                    }
                ],
                max_tokens: 500
            });

            return response.choices[0]?.message?.content || null;
        } catch (error) {
            console.error('Error comparing images:', error);
            return null;
        }
    }

    static async describeImage(imagePath) {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORGANIZATION
        });

        try {
            const imageBuffer = await fs.readFile(imagePath);
            const base64Image = imageBuffer.toString('base64');

            const response = await openai.chat.completions.create({
                model: process.env.VISION_MODEL || 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Describe this React component screenshot. Focus on its visual appearance, layout, and any interactive elements you can see. Be concise but detailed.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/png;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 10500
            });

            return response.choices[0]?.message?.content || 'No description available';
        } catch (error) {
            console.error('Error describing image:', error);
            return 'Error generating description';
        }
    }
} 