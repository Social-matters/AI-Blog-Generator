
// DeepseekAPI service for content generation and plagiarism checking

export interface DeepseekResponse {
  text: string;
}

const API_KEY = '61bc4c084a14404f9c729c18b0b82632';

// Function to generate blog content
export const generateBlogContent = async (
  title: string, 
  purpose: string, 
  keywords: string[]
): Promise<DeepseekResponse> => {
  console.log('Generating blog content with Deepseek API:', { title, purpose, keywords });
  
  try {
    // In a production environment, this would be a server-side call to protect your API key
    const prompt = `Write a blog post with the title: "${title}". 
    The purpose of this blog is to ${purpose}. 
    Please incorporate the following keywords naturally throughout the text: ${keywords.join(', ')}.
    Write in a natural, human-like tone. Format the content using markdown with appropriate headings.`;

    // For demo purposes, we're using a mock response
    // In a real implementation, you would make an API call to Deepseek
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: `# ${title}\n\n${generateMockContent(title, purpose, keywords)}`
        });
      }, 1500);
    });

    // Uncomment below for actual API integration
    /*
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    return {
      text: data.choices[0].message.content
    };
    */
  } catch (error) {
    console.error('Error generating content with Deepseek API:', error);
    throw new Error('Failed to generate content');
  }
};

// Function to check plagiarism
export const checkPlagiarism = async (content: string): Promise<{
  score: number;
  highlightedText: string;
}> => {
  console.log('Checking plagiarism with Deepseek API');
  
  try {
    // In a production environment, this would be a server-side call to protect your API key
    const prompt = `Analyze the following content for plagiarism. Provide a plagiarism percentage score and highlight any potentially plagiarized parts with <span class="plagiarism">plagiarized text</span>:

    ${content}`;

    // For demo purposes, we're using a mock response
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

    // Uncomment below for actual API integration
    /*
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    // Parse the response assuming it contains score and highlighted content
    // This would need to be adapted based on the actual Deepseek API response format
    const responseText = data.choices[0].message.content;
    const scoreMatch = responseText.match(/(\d+)%/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 10;
    
    return {
      score,
      highlightedText: responseText.includes('<span') ? responseText : content
    };
    */
  } catch (error) {
    console.error('Error checking plagiarism with Deepseek API:', error);
    throw new Error('Failed to check plagiarism');
  }
};

// Function to rephrase content
export const rephraseContent = async (
  content: string, 
  keywords: string[]
): Promise<DeepseekResponse> => {
  console.log('Rephrasing content with Deepseek API, keywords:', keywords);
  
  try {
    // In a production environment, this would be a server-side call to protect your API key
    const prompt = `Rephrase the following content while preserving the meaning and ensuring 
    all of these keywords are maintained: ${keywords.join(', ')}. 
    Make sure the rephrased content has a natural, human-like tone:
    
    ${content}`;

    // For demo purposes, we're using a mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: `${generateMockRephrasedContent(content, keywords)}`
        });
      }, 1500);
    });

    // Uncomment below for actual API integration
    /*
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    return {
      text: data.choices[0].message.content
    };
    */
  } catch (error) {
    console.error('Error rephrasing content with Deepseek API:', error);
    throw new Error('Failed to rephrase content');
  }
};

// Helper function to generate mock blog content (for demo purposes)
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

// Helper function to generate mock rephrased content (for demo purposes)
const generateMockRephrasedContent = (content: string, keywords: string[]): string => {
  const keywordHighlights = keywords.map(k => `<span class="highlight">${k}</span>`);
  
  // This would be completely different in a real implementation using Deepseek API
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
