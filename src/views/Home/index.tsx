import React, { useState } from 'react';

import './index.css';
import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';

const Home: React.FC = () => {
  const [terminalExecutableCode, setTerminalExecutableCode] = useState('');

  return (
    <div className="flex-row">
      <MenuBar />
      <main className="main flex-row">
        <MonacoEditor onRunSourceCode={setTerminalExecutableCode} />
        <div className="main--right">
          <Console sourceCode={terminalExecutableCode} />
          <Comments />
        </div>
      </main>
    </div>
  );
};

export default Home;
