
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogWriter from '@/components/BlogWriter';
import PlagiarismChecker from '@/components/PlagiarismChecker';
import ContentRephraser from '@/components/ContentRephraser';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('write');
  const [blogContent, setBlogContent] = useState<string>('');
  const [rephrasedContent, setRephrasedContent] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleNextToPlagiarismCheck = (content: string) => {
    setBlogContent(content);
    setActiveSection('check');
  };

  const handleNextToRephrase = (content: string) => {
    setRephrasedContent(content);
    setActiveSection('rephrase');
  };

  const handleCheckPlagiarismAgain = (content: string) => {
    setBlogContent(content);
    setActiveSection('check');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/6d6231d4-23ad-4d24-a495-15d14e732620.png" 
          alt="Social Matters Logo" 
          className="h-16 mx-auto"
        />
        <p className="text-muted-foreground">Write SEO-optimized content, check plagiarism, and rephrase with ease</p>
      </div>
      
      <Tabs value={activeSection} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger 
            value="write" 
            onClick={() => setActiveSection('write')}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Write
          </TabsTrigger>
          <TabsTrigger 
            value="check" 
            onClick={() => blogContent && setActiveSection('check')}
            disabled={!blogContent}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Check
          </TabsTrigger>
          <TabsTrigger 
            value="rephrase" 
            onClick={() => rephrasedContent && setActiveSection('rephrase')}
            disabled={!rephrasedContent}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Rephrase
          </TabsTrigger>
        </TabsList>
        
        <div className="section-transition">
          <TabsContent value="write" className="mt-0">
            <BlogWriter 
              onNext={handleNextToPlagiarismCheck}
              setKeywords={setKeywords}
            />
          </TabsContent>
          
          <TabsContent value="check" className="mt-0">
            <PlagiarismChecker 
              content={blogContent}
              onBack={() => setActiveSection('write')}
              onRephrase={handleNextToRephrase}
            />
          </TabsContent>
          
          <TabsContent value="rephrase" className="mt-0">
            <ContentRephraser 
              content={rephrasedContent}
              keywords={keywords}
              onBack={() => setActiveSection('check')}
              onCheckPlagiarism={handleCheckPlagiarismAgain}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
