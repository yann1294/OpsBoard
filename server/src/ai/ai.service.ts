import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async summarizeSprint(input: unknown): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const model =
      this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-3-flash-preview';

    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = [
      'You are an engineering delivery assistant.',
      'Create a concise and professional sprint summary using the data below.',
      '',
      'Return exactly these sections:',
      '1. Executive summary',
      '2. Completed work',
      '3. Risks/blockers',
      '4. Recommended next actions',
      '',
      'Keep each section short and clear.',
      '',
      `Sprint data: ${JSON.stringify(input)}`,
    ].join('\n');

    let response: Awaited<ReturnType<typeof ai.models.generateContent>>;
    try {
      response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
    } catch {
      throw new BadGatewayException('Gemini request failed');
    }

    const text = response.text?.trim();
    if (!text) {
      throw new ServiceUnavailableException(
        'Gemini returned an empty summary response',
      );
    }

    return text;
  }
}
