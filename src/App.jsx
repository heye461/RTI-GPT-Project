import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DraftingWizard from './components/DraftingWizard';
import Guide from './components/Guide';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('wizard');
  const [startedDrafting, setStartedDrafting] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Read stored API key from localStorage on startup
  useEffect(() => {
    const storedKey = localStorage.getItem('rti_gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleStartDrafting = () => {
    setActiveTab('wizard');
    setStartedDrafting(true);
  };

  const handleViewGuide = () => {
    setActiveTab('guide');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'wizard' ? (
          startedDrafting ? (
            <DraftingWizard apiKey={apiKey} />
          ) : (
            <Hero 
              onStartDrafting={handleStartDrafting} 
              onViewGuide={handleViewGuide} 
            />
          )
        ) : (
          <Guide />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
