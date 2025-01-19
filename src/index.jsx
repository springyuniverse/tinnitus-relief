import React from 'react';
import ReactDOM from 'react-dom/client';
import TinnitusRelief from './components/TinnitusRelief';
import StoryAndSubscribe from './components/StoryAndSubscribe';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center lg:items-stretch">
        <TinnitusRelief />
        <StoryAndSubscribe />
      </div>
    </div>
  </React.StrictMode>
);
