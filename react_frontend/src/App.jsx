import React from 'react';
import BookList from './BookList';
import PostList from './PostList';
import ArticleList from './ArticleList';
import Notifications from "./components/Notifications";
import WelcomeMessage from './WelcomeMessage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            React + Tailwind + Rails
          </h1>
          <p className="mt-2 text-gray-500">A demonstration of Functional and Class Components</p>
        </header>

        <WelcomeMessage />
        <BookList />
        <PostList />
        <ArticleList />
        <Notifications />
      </div>
    </div>
  );
}

export default App;
