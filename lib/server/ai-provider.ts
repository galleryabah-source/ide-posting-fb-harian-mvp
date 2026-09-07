import type { ContentIdea } from "../content-engine";

export interface AiContentProvider {
  generatePost(input: ContentIdea): Promise<string>;
}

class DeterministicFallbackProvider implements AiContentProvider {
  async generatePost(input: ContentIdea): Promise<string> {
    const { generatePost } = await import("../content-engine");
    return generatePost(input);
  }
}

export function getAiContentProvider(): AiContentProvider {
  // Provider wiring is intentionally deferred until a real AI credential is configured.
  // The application therefore remains functional without an AI dependency.
  return new DeterministicFallbackProvider();
}
