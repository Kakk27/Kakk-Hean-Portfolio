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

export const createProject = async (projectData) => {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Failed to create project');
        return await response.json();
    } catch (error) {
        console.error("Create project error:", error);
        throw error;
    }
};

export const updateProject = async (id, projectData) => {
    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Failed to update project');
        return await response.json();
    } catch (error) {
        console.error("Update project error:", error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete project');
        return await response.json();
    } catch (error) {
        console.error("Delete project error:", error);
        throw error;
    }
};
