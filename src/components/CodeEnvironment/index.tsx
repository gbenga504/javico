import React from 'react';
import MenuBar from './MenuBar';
import EditorSection from './EditorSection';
import Console from './Console';
import Comments from './Comments';

const CodeEnvironment: React.FC = () => {
  return (
    <div>
      <MenuBar />
      <EditorSection />
      <div>
        <Console />
        <Comments />
      </div>
    </div>
  );
};

export default CodeEnvironment;
