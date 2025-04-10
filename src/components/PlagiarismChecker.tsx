
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { checkPlagiarism } from '@/services/openai';

interface PlagiarismCheckerProps {
  content: string;
  onBack: () => void;
  onRephrase: (content: string) => void;
}

const PlagiarismChecker: React.FC<PlagiarismCheckerProps> = ({ 
  content, 
  onBack, 
  onRephrase 
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [highlightedContent, setHighlightedContent] = useState<string>('');
  
  useEffect(() => {
    if (content) {
      // Reset the state when content changes
      setPlagiarismScore(null);
      setHighlightedContent('');
    }
  }, [content]);

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
            <Button onClick={handleCheck} variant="outline" size="sm" disabled={isChecking}>
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Plagiarism'
              )}
            </Button>
          </div>
          
          <div 
            className="border rounded-md p-4 min-h-[300px] max-h-[400px] overflow-y-auto prose prose-sm"
            dangerouslySetInnerHTML={{ __html: highlightedContent || content }}
          />
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
            onClick={() => onRephrase(highlightedContent || content)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={isChecking}
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
