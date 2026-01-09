import React, { useState, useEffect } from 'react';
import { fetchPosts, createPost, updatePost, deletePost } from './services/postService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await fetchPosts();
            setPosts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updatePost(editingId, newPost);
                setEditingId(null);
            } else {
                await createPost(newPost);
            }
            setNewPost({ title: '', body: '' });
            loadPosts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (post) => {
        setEditingId(post.id || post._id?.$oid || post._id);
        setNewPost({ title: post.title, body: post.body });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewPost({ title: '', body: '' });
    };

    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts(posts.filter((post) => post._id?.$oid !== id && post.id !== id));
            loadPosts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Create/Edit Post Form */}
            <div className="glass-card rounded-3xl p-8 mb-8 shadow-2xl border border-blue-500/20">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                    {editingId ? '✏️ Edit Post' : '➕ Create New Post'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Post Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter post title..."
                            value={newPost.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Post Content</label>
                        <textarea
                            name="body"
                            placeholder="Write your post content..."
                            value={newPost.body}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${editingId
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/30'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30'
                                }`}
                        >
                            {editingId ? '💾 Update Post' : '➕ Create Post'}
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

            {/* Post List */}
            {posts.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-2">No Posts Yet</h3>
                    <p className="text-gray-400">Create your first post to get started!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => {
                        const postId = post.id || post._id?.$oid || post._id;
                        return (
                            <div
                                key={postId}
                                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/20 border border-blue-500/20"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {post.body}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg shadow-blue-500/30"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(postId)}
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

export default PostList;
