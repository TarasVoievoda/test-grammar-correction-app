import { generateObject, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import RateLimitService from '../../../services/rate-limit.service';

const rateLimiter = new RateLimitService(
  50,
  60 * 60 * 1000
);

export async function POST(req) {
  const rateLimitResponse = rateLimiter.limit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { input } = await req.json();

  const { object: { corrections } } = await generateObject({
    model: openai('gpt-4o-mini'),
    system: "Find all grammatical mistakes in the given text and return a JSON array where each item contains { word: incorrect_word, suggestion: corrected_word }. Do not return any other text.",
    prompt: input,
    schema: z.object({
      corrections: z.array(z.object({
        word: z.string(),
        suggestion: z.string(),
      }))
    })
  });


  if (!corrections) {
    return Response.json({ message: "Error in OpenAI API" }, {
      status: 500
    });
  }

  return Response.json({ corrections });
}
