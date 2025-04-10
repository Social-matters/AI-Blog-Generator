import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Loader2, AlertCircle, Copy, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import KeywordTag from './KeywordTag';
import { rephraseContent } from '@/services/deepseek';

interface ContentRephraserProps {
  content: string;
  keywords: string[];
  onBack: () => void;
  onCheckPlagiarism: (content: string) => void;
}

const ContentRephraser: React.FC<ContentRephraserProps> = ({ 
  content: initialContent, 
  keywords, 
  onBack, 
  onCheckPlagiarism 
}) => {
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [rephrasedContent, setRephrasedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (content && !rephrasedContent) {
      handleRephrase();
    }
  }, [content]);

  const handleRephrase = async () => {
    if (!content) {
      toast.error('No content to rephrase');
      return;
    }

    setIsRephrasing(true);
    try {
      const result = await rephraseContent(content, keywords);
      setRephrasedContent(result.text);
      toast.success('Content rephrased successfully');
    } catch (error) {
      console.error('Error rephrasing content:', error);
      toast.error('Failed to rephrase content. Please try again.');
    } finally {
      setIsRephrasing(false);
    }
  };

  const handleCopyContent = async () => {
    if (!rephrasedContent) {
      toast.error('No content to copy');
      return;
    }
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = rephrasedContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(textContent);
      setIsCopied(true);
      toast.success('Content copied to clipboard');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying content:', error);
      toast.error('Failed to copy content');
    }
  };

  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const highlightKeywords = (text: string, keywords: string[]): React.ReactNode => {
    if (!text) return null;
    
    const plainText = text.includes('<') ? stripHtml(text) : text;
    
    return plainText;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="mr-2" size={20} />
          Content Rephraser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Keywords to Preserve</label>
          </div>
          <div className="flex flex-wrap mb-4">
            {keywords.map((keyword, index) => (
              <KeywordTag key={index} keyword={keyword} onRemove={() => {}} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Original Content</label>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type content here to rephrase"
            className="min-h-[200px] mb-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Rephrased Content</label>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCopyContent} 
                variant="outline" 
                size="sm"
                disabled={isRephrasing || !rephrasedContent}
              >
                {isCopied ? (
                  <>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button 
                onClick={handleRephrase} 
                variant="outline" 
                size="sm"
                disabled={isRephrasing || !content}
              >
                {isRephrasing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rephrasing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2" size={14} />
                    Rephrase
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isRephrasing ? (
            <div className="border rounded-md p-4 h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-gray-500">Rephrasing your content while preserving keywords...</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-md p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {rephrasedContent ? (
                <div dangerouslySetInnerHTML={{ __html: rephrasedContent }} />
              ) : (
                <p className="text-gray-500">Content will appear here after rephrasing...</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            onClick={onBack}
            className="flex items-center"
            disabled={isRephrasing}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>

          <Button 
            onClick={() => onCheckPlagiarism(rephrasedContent)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            disabled={!rephrasedContent || isRephrasing}
          >
            <AlertCircle className="mr-2" size={16} />
            Check Plagiarism Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentRephraser;
