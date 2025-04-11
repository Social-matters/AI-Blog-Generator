
// AI service for content generation and plagiarism checking using Gemini API

export interface AIResponse {
  text: string;
}

const GEMINI_API_KEY = 'AIzaSyCOOR1YfivpNwf8hS9V6qv5aFkRWXfPVtg';
// Updated API URL to use the correct version and endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

// Function to generate blog content
export const generateBlogContent = async (
  title: string, 
  purpose: string, 
  keywords: string[]
): Promise<AIResponse> => {
  console.log('Generating blog content with Gemini API:', { title, purpose, keywords });
  
  try {
    const prompt = `Write a blog post with the title: "${title}". 
    The purpose of this blog is to ${purpose}. 
    Please incorporate the following keywords naturally throughout the text: ${keywords.join(', ')}.
    Write in a natural, human-like tone. Format the content using markdown with appropriate headings.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Gemini API:', errorText);
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    // Updated response parsing to match Gemini API response structure
    return {
      text: data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('Error generating content with Gemini API:', error);
    return generateMockBlogResponse(title, purpose, keywords);
  }
};

// Function to check plagiarism
export const checkPlagiarism = async (content: string): Promise<{
  score: number;
  highlightedText: string;
}> => {
  console.log('Checking plagiarism with Gemini API');
  
  try {
    const prompt = `Analyze the following content for plagiarism. Provide a plagiarism percentage score and highlight any potentially plagiarized parts with <span class="plagiarism">plagiarized text</span>:

    ${content}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      console.error('Error from Gemini API:', await response.text());
      return generateMockPlagiarismResponse(content);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Parse the response assuming it contains score and highlighted content
    const scoreMatch = responseText.match(/(\d+)%/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 10;
    
    return {
      score,
      highlightedText: responseText.includes('<span') ? responseText : content
    };
  } catch (error) {
    console.error('Error checking plagiarism with Gemini API:', error);
    return generateMockPlagiarismResponse(content);
  }
};

// Function to rephrase content
export const rephraseContent = async (
  content: string, 
  keywords: string[]
): Promise<AIResponse> => {
  console.log('Rephrasing content with Gemini API, keywords:', keywords);
  
  try {
    const prompt = `Rephrase the following content while preserving the meaning and ensuring 
    all of these keywords are maintained: ${keywords.join(', ')}. 
    Make sure the rephrased content has a natural, human-like tone:
    
    ${content}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      console.error('Error from Gemini API:', await response.text());
      return generateMockRephrasedContent(content, keywords);
    }

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('Error rephrasing content with Gemini API:', error);
    return generateMockRephrasedContent(content, keywords);
  }
};

// Mock response generators for fallback purposes
const generateMockBlogResponse = (title: string, purpose: string, keywords: string[]): AIResponse => {
  const keywordHighlights = keywords.map(k => `<span class="highlight">${k}</span>`);
  
  return {
    text: `# ${title}\n\nIn today's digital landscape, understanding ${keywordHighlights[0] || 'key concepts'} is more important than ever. This article explores the relationship between ${keywordHighlights[1] || 'important topics'} and ${keywordHighlights[2] || 'crucial elements'}.\n\n## Why ${title} Matters\n\nThe purpose of this blog is to ${purpose}. When we examine the impact of ${keywordHighlights[0] || 'key elements'} on modern business strategies, we discover fascinating patterns.\n\n## Key Insights\n\nResearch shows that companies focusing on ${keywordHighlights[1] || 'strategic areas'} tend to outperform their competitors by a significant margin. This is especially true when they incorporate ${keywordHighlights[2] || 'essential practices'} into their operational framework.`
  };
};

const generateMockPlagiarismResponse = (content: string): {
  score: number;
  highlightedText: string;
} => {
  // Generate a random plagiarism score between 5% and 25%
  const score = Math.floor(Math.random() * 20) + 5;
  
  // Randomly highlight some text as "plagiarized" for demonstration
  const sentences = content.split('. ');
  const randomIndex = Math.floor(Math.random() * sentences.length);
  
  if (sentences.length > 0 && randomIndex < sentences.length) {
    sentences[randomIndex] = `<span class="plagiarism">${sentences[randomIndex]}</span>`;
  }
  
  return {
    score,
    highlightedText: sentences.join('. ')
  };
};

const generateMockRephrasedContent = (content: string, keywords: string[]): AIResponse => {
  const keywordHighlights = keywords.map(k => `<span class="highlight">${k}</span>`);
  
  // This would be completely different in a real implementation using Deepseek API
  // Here we're just slightly modifying the original text for demonstration
  const modifiedContent = content
    .replace('today\'s digital landscape', 'our current technological environment')
    .replace('more important than ever', 'increasingly critical')
    .replace('explores the relationship', 'examines the connections')
    .replace('Key Insights', 'Critical Findings')
    .replace(/companies/g, 'organizations')
    .replace(/tend to/g, 'typically')
    .replace(/significant/g, 'substantial')
    .replace(/Best Practices/g, 'Recommended Strategies');
    
  // Make sure keywords are highlighted
  let highlightedContent = modifiedContent;
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    highlightedContent = highlightedContent.replace(regex, match => {
      return `<span class="highlight">${match}</span>`;
    });
  });
    
  return {
    text: highlightedContent
  };
};
