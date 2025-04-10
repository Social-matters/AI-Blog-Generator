
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, AlertCircle, Loader2, RefreshCw, Copy, CheckCheck, Edit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { checkPlagiarism } from '@/services/deepseek';

interface PlagiarismCheckerProps {
  content: string;
  onBack: () => void;
  onRephrase: (content: string) => void;
}

const PlagiarismChecker: React.FC<PlagiarismCheckerProps> = ({ 
  content: initialContent, 
  onBack, 
  onRephrase 
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [highlightedContent, setHighlightedContent] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // Strip HTML tags helper function
  const stripHtml = (html: string): string => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  useEffect(() => {
    if (highlightedContent) {
      setEditedContent(stripHtml(highlightedContent));
    } else if (content) {
      setEditedContent(stripHtml(content));
    }
  }, [highlightedContent, content]);

  const handleCheck = async () => {
    if (!content) {
      toast.error('No content to check');
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkPlagiarism(content);
      setPlagiarismScore(result.score);
      setHighlightedContent(result.highlightedText);
      setEditedContent(stripHtml(result.highlightedText));
      
      if (result.score > 20) {
        toast.warning('High plagiarism detected. Consider rephrasing your content.');
      } else if (result.score > 10) {
        toast.info('Some potentially similar content detected. Rephrasing might be helpful.');
      } else {
        toast.success('Minimal plagiarism detected. Your content looks good!');
      }
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      toast.error('Failed to check plagiarism. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedContent : stripHtml(highlightedContent || content));
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

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const getScoreColor = () => {
    if (!plagiarismScore) return 'bg-gray-300';
    if (plagiarismScore > 20) return 'bg-red-500';
    if (plagiarismScore > 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="mr-2" size={20} />
          Plagiarism Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Content Analysis</label>
            <div className="flex space-x-2">
              <Button onClick={handleCopyContent} variant="outline" size="sm" className="bg-black text-white hover:bg-black/80">
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
              <Button onClick={handleCheck} variant="outline" size="sm" disabled={isChecking} className="bg-black text-white hover:bg-black/80">
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Plagiarism'
                )}
              </Button>
              {(highlightedContent || content) && (
                <Button onClick={handleToggleEdit} variant="outline" size="sm" className="bg-black text-white hover:bg-black/80">
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? 'View Result' : 'Edit'}
                </Button>
              )}
            </div>
          </div>
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type content here to check for plagiarism"
            className="min-h-[300px] mb-4"
          />
          
          {(highlightedContent || editedContent) && (
            isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Edit content here..."
                className="min-h-[200px] mb-4 font-mono text-sm"
              />
            ) : (
              <div className="border rounded-md p-4 min-h-[200px] max-h-[300px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                {stripHtml(highlightedContent || content)}
              </div>
            )
          )}
        </div>

        {plagiarismScore !== null && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Plagiarism Score</span>
              <span className={`text-sm font-bold ${
                plagiarismScore > 20 
                  ? 'text-red-500' 
                  : plagiarismScore > 10 
                    ? 'text-yellow-500' 
                    : 'text-green-500'
              }`}>
                {plagiarismScore}%
              </span>
            </div>
            <Progress value={plagiarismScore} className={getScoreColor()} />
            
            <p className="text-sm text-gray-500 mt-2">
              {plagiarismScore > 20 
                ? 'High plagiarism detected. We recommend rephrasing your content.' 
                : plagiarismScore > 10 
                  ? 'Some similar content detected. Consider rephrasing affected sections.'
                  : 'Low plagiarism detected. Your content looks mostly original!'}
            </p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>

          <Button 
            onClick={() => onRephrase(isEditing ? editedContent : stripHtml(highlightedContent || content))}
            className="bg-black hover:bg-black/80 text-white"
            disabled={isChecking || !content}
          >
            <RefreshCw className="mr-2" size={16} />
            Rephrase Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlagiarismChecker;
