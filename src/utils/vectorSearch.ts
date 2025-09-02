// Simplified vector similarity search implementation
export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Simple text-to-vector conversion (in production, use proper embeddings)
export function textToVector(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const vector = new Array(100).fill(0);
  
  words.forEach((word, index) => {
    const hash = word.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    vector[Math.abs(hash) % 100] += 1;
  });
  
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
}

export function searchSimilar<T extends { content?: string; question?: string }>(
  query: string,
  items: T[],
  threshold: number = 0.5,
  limit: number = 5
): (T & { similarity: number })[] {
  const queryVector = textToVector(query);
  
  const results = items.map(item => {
    const text = item.content || item.question || '';
    const itemVector = textToVector(text);
    const similarity = cosineSimilarity(queryVector, itemVector);
    return { ...item, similarity };
  });
  
  return results
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}