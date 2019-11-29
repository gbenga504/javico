import React from 'react';
import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';

const CodeEnvironmentView: React.FC = () => {
  return (
    <div className="flex-row">
      <MenuBar />
      <MonacoEditor />
      <div>
        <Console />
        <Comments />
      </div>
    </div>
  );
};

export default CodeEnvironmentView;
