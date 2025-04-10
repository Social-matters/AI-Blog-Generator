
// This is a mock implementation for demonstration purposes
// In a real application, you would need to use the actual OpenAI API with your API key

export interface OpenAIResponse {
  text: string;
}

// Mock function for generating blog content
export const generateBlogContent = async (
  title: string, 
  purpose: string, 
  keywords: string[]
): Promise<OpenAIResponse> => {
  console.log('Generating blog content with:', { title, purpose, keywords });
  
  // In a real implementation, you would call the OpenAI API here
  // For demo purposes, we'll return a mock response after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: `# ${title}\n\n${generateMockContent(title, purpose, keywords)}`
      });
    }, 1500);
  });
};

// Mock function for checking plagiarism
export const checkPlagiarism = async (content: string): Promise<{
  score: number;
  highlightedText: string;
}> => {
  console.log('Checking plagiarism for content');
  
  // In a real implementation, you would call a plagiarism API
  // For demo purposes, we'll return a mock response after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random plagiarism score between 5% and 25%
      const score = Math.floor(Math.random() * 20) + 5;
      
      // Randomly highlight some text as "plagiarized" for demonstration
      const sentences = content.split('. ');
      const randomIndex = Math.floor(Math.random() * sentences.length);
      
      if (sentences.length > 0 && randomIndex < sentences.length) {
        sentences[randomIndex] = `<span class="plagiarism">${sentences[randomIndex]}</span>`;
      }
      
      resolve({
        score,
        highlightedText: sentences.join('. ')
      });
    }, 1500);
  });
};

// Mock function for rephrasing content
export const rephraseContent = async (
  content: string, 
  keywords: string[]
): Promise<OpenAIResponse> => {
  console.log('Rephrasing content with keywords:', keywords);
  
  // In a real implementation, you would call the OpenAI API here
  // For demo purposes, we'll return a mock response after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: `${generateMockRephrasedContent(content, keywords)}`
      });
    }, 1500);
  });
};

// Helper function to generate mock blog content
const generateMockContent = (title: string, purpose: string, keywords: string[]): string => {
  const keywordHighlights = keywords.map(k => `<span class="highlight">${k}</span>`);
  
  return `
In today's digital landscape, understanding ${keywordHighlights[0] || 'key concepts'} is more important than ever. This article explores the relationship between ${keywordHighlights[1] || 'important topics'} and ${keywordHighlights[2] || 'crucial elements'}.

## Why ${title} Matters

The purpose of this blog is to ${purpose}. When we examine the impact of ${keywordHighlights[0] || 'key elements'} on modern business strategies, we discover fascinating patterns.

## Key Insights

Research shows that companies focusing on ${keywordHighlights[1] || 'strategic areas'} tend to outperform their competitors by a significant margin. This is especially true when they incorporate ${keywordHighlights[2] || 'essential practices'} into their operational framework.

## Best Practices

1. Always start with a clear understanding of ${keywordHighlights[0] || 'fundamental concepts'}
2. Regularly review your approach to ${keywordHighlights[1] || 'key areas'}
3. Implement comprehensive strategies for ${keywordHighlights[2] || 'critical elements'}

## Conclusion

By embracing these principles, organizations can effectively navigate the complexities of today's market while maintaining a competitive edge through intelligent application of ${keywordHighlights[0] || 'core concepts'} and ${keywordHighlights[1] || 'strategic approaches'}.
  `;
};

// Helper function to generate mock rephrased content
const generateMockRephrasedContent = (content: string, keywords: string[]): string => {
  const keywordHighlights = keywords.map(k => `<span class="highlight">${k}</span>`);
  
  // This would be completely different in a real implementation using OpenAI
  // Here we're just slightly modifying the original text for demonstration
  return content
    .replace('today\'s digital landscape', 'our current technological environment')
    .replace('more important than ever', 'increasingly critical')
    .replace('explores the relationship', 'examines the connections')
    .replace('Key Insights', 'Critical Findings')
    .replace(/companies/g, 'organizations')
    .replace(/tend to/g, 'typically')
    .replace(/significant/g, 'substantial')
    .replace(/Best Practices/g, 'Recommended Strategies')
    // Make sure keywords are highlighted
    .replace(new RegExp(keywords.join('|'), 'gi'), match => {
      return `<span class="highlight">${match}</span>`;
    });
};
