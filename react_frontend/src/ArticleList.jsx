import React, { useState, useEffect } from 'react';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from './services/articleService';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({ title: '', content: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const data = await fetchArticles();
            setArticles(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewArticle({ ...newArticle, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateArticle(editingId, newArticle);
                setEditingId(null);
            } else {
                await createArticle(newArticle);
            }
            setNewArticle({ title: '', content: '' });
            loadArticles();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (article) => {
        setEditingId(article.id || article._id?.$oid || article._id);
        setNewArticle({ title: article.title, content: article.content });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewArticle({ title: '', content: '' });
    };

    const handleDelete = async (id) => {
        try {
            await deleteArticle(id);
            setArticles(articles.filter((article) => article._id?.$oid !== id && article.id !== id));
            loadArticles();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Create/Edit Article Form */}
            <div className="glass-card rounded-3xl p-8 mb-8 shadow-2xl border border-teal-500/20">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                    {editingId ? '✏️ Edit Article' : '➕ Write New Article'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Article Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter article title..."
                            value={newArticle.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Article Content</label>
                        <textarea
                            name="content"
                            placeholder="Write your article content..."
                            value={newArticle.content}
                            onChange={handleInputChange}
                            rows="5"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${editingId
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/30'
                                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30'
                                }`}
                        >
                            {editingId ? '💾 Update Article' : '➕ Publish Article'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 bg-gray-600/50 text-white rounded-xl hover:bg-gray-600/70 transition-all font-semibold"
                            >
                                ✖️ Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Article List */}
            {articles.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                    <div className="text-6xl mb-4">📰</div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-2">No Articles Yet</h3>
                    <p className="text-gray-400">Write your first article to get started!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {articles.map((article) => {
                        const articleId = article.id || article._id?.$oid || article._id;
                        return (
                            <div
                                key={articleId}
                                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group hover:shadow-2xl hover:shadow-teal-500/20 border border-teal-500/20"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {article.content}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg shadow-blue-500/30"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(articleId)}
                                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-lg shadow-red-500/30"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ArticleList;
