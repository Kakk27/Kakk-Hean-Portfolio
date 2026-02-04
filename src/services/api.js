// configuration for API
const API_URL = 'http://localhost:5000/api';

export const login = async (password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return await response.json();
    } catch (error) {
        console.error("Login error:", error);
        // Fallback for demo if backend isn't running
        if (password === 'admin123') return { success: true };
        return { success: false };
    }
};

export const fetchProjects = async () => {
    try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error("Fetch projects error:", error);
        return [];
    }
};
