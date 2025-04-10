
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowRight, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SEOKeywordInput from './SEOKeywordInput';
import { generateBlogContent } from '@/services/openai';

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
      toast.success('Blog content generated successfully');
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
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Generated Content
            </label>
            <div 
              className="border rounded-md p-4 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <Button 
              className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
