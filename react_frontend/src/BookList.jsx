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
            loadBooks(); // Reload to be sure
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Library Books</h2>

            {/* Create/Edit Book Form */}
            <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{editingId ? 'Edit Book' : 'Add a New Book'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newBook.description}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className={`mt-4 w-full text-white py-2 px-4 rounded transition font-medium ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {editingId ? 'Update Book' : 'Add Book'}
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

            {/* Book List */}
            <ul className="space-y-4">
                {books.map((book) => {
                    // Handle potential ID differences (Mongoid might return $oid or just a string id)
                    const bookId = book.id || book._id?.$oid || book._id;
                    return (
                        <li key={bookId} className="p-5 border border-gray-200 rounded-lg hover:shadow-lg transition bg-white flex justify-between items-center group">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
                                <p className="text-gray-600 italic">by {book.author}</p>
                                <p className="text-gray-500 mt-1">{book.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={() => handleEdit(book)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(bookId)}
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

export default BookList;
