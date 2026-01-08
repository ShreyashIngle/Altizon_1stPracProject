const API_URL = "http://localhost:3000/articles";

export const fetchArticles = async () => {
    const response = await fetch(`${API_URL}.json`);
    if (!response.ok) {
        throw new Error("Failed to fetch articles");
    }
    return response.json();
};

export const createArticle = async (article) => {
    const response = await fetch(`${API_URL}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ article }),
    });
    return response.json();
};

export const updateArticle = async (id, article) => {
    const response = await fetch(`${API_URL}/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ article }),
    });
    if (!response.ok) {
        throw new Error("Failed to update article");
    }
    return response.json();
};

export const deleteArticle = async (id) => {
    const response = await fetch(`${API_URL}/${id}.json`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete article");
    }
};
