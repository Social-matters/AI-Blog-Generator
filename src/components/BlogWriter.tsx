
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowRight, FileText, Loader2, Copy, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import SEOKeywordInput from './SEOKeywordInput';
import { generateBlogContent } from '@/services/deepseek';

interface BlogWriterProps {
  onNext: (content: string) => void;
  setKeywords: (keywords: string[]) => void;
}

const BlogWriter: React.FC<BlogWriterProps> = ({ onNext, setKeywords }) => {
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateContent = async () => {
    if (!title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }

    if (!purpose.trim()) {
      toast.error('Please enter a blog purpose');
      return;
    }

    if (keywordList.length === 0) {
      toast.error('Please add at least one SEO keyword');
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateBlogContent(title, purpose, keywordList);
      setContent(result.text);
      setIsGenerated(true);
      toast.success('Blog content generated successfully with Gemini AI');
      // Save keywords for later use in other components
      setKeywords(keywordList);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!content) {
      toast.error('Please generate content first');
      return;
    }
    onNext(content);
  };

  const handleCopyContent = async () => {
    if (!content) {
      toast.error('No content to copy');
      return;
    }
    
    try {
      // Create a temporary element to remove HTML tags
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(textContent);
      setIsCopied(true);
      toast.success('Content copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying content:', error);
      toast.error('Failed to copy content');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2" size={20} />
          Blog Writing & SEO Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Blog Title
          </label>
          <Input
            id="title"
            placeholder="Enter your blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium mb-1">
            Blog Purpose
          </label>
          <Textarea
            id="purpose"
            placeholder="Describe the purpose of your blog"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-1">
            SEO Keywords
          </label>
          <SEOKeywordInput keywords={keywordList} setKeywords={setKeywordList} />
        </div>

        <Button 
          onClick={handleGenerateContent} 
          disabled={isGenerating}
          className="w-full bg-black hover:bg-black/80 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Content...
            </>
          ) : (
            'Generate Blog Content'
          )}
        </Button>

        {content && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium">
                Generated Content
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                className="flex items-center bg-black text-white hover:bg-black/80"
              >
                {isCopied ? (
                  <>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Content
                  </>
                )}
              </Button>
            </div>
            <div 
              className="border rounded-md p-4 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <Button 
              className="mt-4 w-full flex items-center justify-center bg-black hover:bg-black/80 text-white"
              onClick={handleNext}
              disabled={!isGenerated}
            >
              Check Plagiarism
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogWriter;
