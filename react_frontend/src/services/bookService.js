const API_URL = "http://localhost:3000/books";

export const fetchBooks = async () => {
    const response = await fetch(`${API_URL}.json`);
    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }
    return response.json();
};

export const createBook = async (book) => {
    const response = await fetch(`${API_URL}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ book }),
    });
    if (!response.ok) {
        throw new Error("Failed to create book");
    }
    return response.json();
};

export const updateBook = async (id, book) => {
    const response = await fetch(`${API_URL}/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ book }),
    });
    if (!response.ok) {
        throw new Error("Failed to update book");
    }
    return response.json();
};

export const deleteBook = async (id) => {
    const response = await fetch(`${API_URL}/${id}.json`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete book");
    }
};
