const API_URL = "http://localhost:3000/posts";

export const fetchPosts = async () => {
    const response = await fetch(`${API_URL}.json`);
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
};

export const createPost = async (post) => {
    const response = await fetch(`${API_URL}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
    });
    return response.json();
};

export const updatePost = async (id, post) => {
    const response = await fetch(`${API_URL}/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
    });
    if (!response.ok) {
        throw new Error("Failed to update post");
    }
    return response.json();
};

export const deletePost = async (id) => {
    const response = await fetch(`${API_URL}/${id}.json`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete post");
    }
};
