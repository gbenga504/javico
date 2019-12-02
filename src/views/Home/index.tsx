import React from 'react';

import './index.css';
import MenuBar from '../../components/MenuBar';
import MonacoEditor from '../../components/MonacoEditor';
import Console from '../../components/Console';
import Comments from '../../components/Comments';

const Home: React.FC = () => {
  return (
    <div className="flex-row">
      <MenuBar />
      <main className="main flex-row">
        <MonacoEditor />
        <div className="main--right">
          <Console />
          <Comments />
        </div>
      </main>
    </div>
  );
};

export default Home;
