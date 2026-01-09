import React, { useState, useEffect } from 'react';
import { fetchBooks, createBook, updateBook, deleteBook } from './services/bookService';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const data = await fetchBooks();
            setBooks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateBook(editingId, newBook);
                setEditingId(null);
            } else {
                await createBook(newBook);
            }
            setNewBook({ title: '', author: '', description: '' });
            loadBooks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (book) => {
        setEditingId(book.id || book._id?.$oid || book._id);
        setNewBook({ title: book.title, author: book.author, description: book.description });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewBook({ title: '', author: '', description: '' });
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            setBooks(books.filter((book) => book._id?.$oid !== id && book.id !== id));
            loadBooks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Create/Edit Book Form */}
            <div className="glass-card rounded-3xl p-8 mb-8 shadow-2xl border border-purple-500/20">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                    {editingId ? '✏️ Edit Book' : '➕ Add New Book'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Book Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter book title..."
                                value={newBook.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Author Name</label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Enter author name..."
                                value={newBook.author}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            placeholder="Enter book description..."
                            value={newBook.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${editingId
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/30'
                                    : 'btn-gradient shadow-lg shadow-purple-500/30'
                                }`}
                        >
                            {editingId ? '💾 Update Book' : '➕ Add Book'}
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

            {/* Book List */}
            {books.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-2">No Books Yet</h3>
                    <p className="text-gray-400">Add your first book to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => {
                        const bookId = book.id || book._id?.$oid || book._id;
                        return (
                            <div
                                key={bookId}
                                className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-500/20"
                            >
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-purple-300 font-medium mb-3">
                                        ✍️ {book.author}
                                    </p>
                                    <p className="text-gray-400 text-sm line-clamp-3">
                                        {book.description || 'No description available'}
                                    </p>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => handleEdit(book)}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg shadow-blue-500/30"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bookId)}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-lg shadow-red-500/30"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookList;
