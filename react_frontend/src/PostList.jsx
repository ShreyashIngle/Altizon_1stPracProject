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
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Posts</h2>

            {/* Create/Edit Post Form */}
            <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{editingId ? 'Edit Post' : 'Add a New Post'}</h3>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        name="body"
                        placeholder="Body"
                        value={newPost.body}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className={`mt-4 w-full text-white py-2 px-4 rounded transition font-medium ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {editingId ? 'Update Post' : 'Add Post'}
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

            {/* Post List */}
            <ul className="space-y-4">
                {posts.map((post) => {
                    const postId = post.id || post._id?.$oid || post._id;
                    return (
                        <li key={postId} className="p-5 border border-gray-200 rounded-lg hover:shadow-lg transition bg-white flex justify-between items-center group">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                                <p className="text-gray-600 mt-1">{post.body}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(postId)}
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

export default PostList;
