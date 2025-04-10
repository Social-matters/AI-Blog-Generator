
import React from 'react';
import { X } from 'lucide-react';

interface KeywordTagProps {
  keyword: string;
  onRemove: () => void;
}

const KeywordTag: React.FC<KeywordTagProps> = ({ keyword, onRemove }) => {
  return (
    <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
      <span>{keyword}</span>
      <button 
        type="button" 
        onClick={onRemove} 
        className="ml-1.5 text-blue-800 hover:text-blue-900 focus:outline-none"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default KeywordTag;
