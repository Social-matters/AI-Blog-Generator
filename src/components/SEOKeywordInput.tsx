
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import KeywordTag from './KeywordTag';

interface SEOKeywordInputProps {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

const SEOKeywordInput: React.FC<SEOKeywordInputProps> = ({ keywords, setKeywords }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addKeyword(inputValue.trim());
    } else if (e.key === ',' && inputValue.trim()) {
      e.preventDefault();
      addKeyword(inputValue.trim().replace(',', ''));
    }
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
      setInputValue('');
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2">
        <Input
          placeholder="Add SEO keywords (press Enter or comma to add)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mb-2"
        />
      </div>
      <div className="flex flex-wrap">
        {keywords.map((keyword, index) => (
          <KeywordTag 
            key={index} 
            keyword={keyword} 
            onRemove={() => removeKeyword(index)} 
          />
        ))}
      </div>
    </div>
  );
};

export default SEOKeywordInput;
