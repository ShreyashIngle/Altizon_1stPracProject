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
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Articles</h2>

            {/* Create/Edit Article Form */}
            <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{editingId ? 'Edit Article' : 'Add a New Article'}</h3>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newArticle.title}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        name="content"
                        placeholder="Content"
                        value={newArticle.content}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className={`mt-4 w-full text-white py-2 px-4 rounded transition font-medium ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {editingId ? 'Update Article' : 'Add Article'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition font-medium"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Article List */}
            <ul className="space-y-4">
                {articles.map((article) => {
                    const articleId = article.id || article._id?.$oid || article._id;
                    return (
                        <li key={articleId} className="p-5 border border-gray-200 rounded-lg hover:shadow-lg transition bg-white flex justify-between items-center group">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{article.title}</h3>
                                <p className="text-gray-600 mt-1">{article.content}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={() => handleEdit(article)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(articleId)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ArticleList;
