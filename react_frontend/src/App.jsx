import React, { useState } from 'react';
import BookList from './BookList';
import PostList from './PostList';
import ArticleList from './ArticleList';
import Notifications from "./components/Notifications";

function App() {
  const [activeTab, setActiveTab] = useState('books');

  const tabs = [
    { id: 'books', label: '📚 Books', icon: '📚' },
    { id: 'posts', label: '📝 Posts', icon: '📝' },
    { id: 'articles', label: '📰 Articles', icon: '📰' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-black mb-4 gradient-text">
            Content Manager
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Manage your books, posts, and articles with real-time updates
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <div className="glass rounded-2xl p-2 inline-flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label.replace(/^📚 |^📝 |^📰 /, '')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-slide-in">
          {activeTab === 'books' && <BookList />}
          {activeTab === 'posts' && <PostList />}
          {activeTab === 'articles' && <ArticleList />}
        </div>

        {/* Notifications */}
        <Notifications />
      </div>
    </div>
  );
}

export default App;
