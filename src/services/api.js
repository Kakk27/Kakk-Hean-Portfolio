import { db } from "../firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "firebase/firestore";

const collectionName = "projects";

export const login = async (password) => {
    try {
        // Fallback for simple demo authentication
        // For production, you would use Firebase Authentication instead.
        if (password === 'admin122' || password === 'admin123') {
            return { success: true, token: 'mock-jwt-token-kakk-portfolio', user: { name: 'Admin', role: 'owner' } };
        }
        return { success: false, message: 'Invalid credentials' };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false };
    }
};

export const fetchProjects = async () => {
    try {
        const q = query(collection(db, collectionName)); // You can add orderBy("createdAt", "desc") if you add timestamps
        const querySnapshot = await getDocs(q);
        const projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        return projects;
    } catch (error) {
        console.error("Fetch projects error:", error);
        return [];
    }
};

export const createProject = async (projectData) => {
    try {
        if (!projectData.createdAt) {
            projectData.createdAt = new Date().toISOString();
        }
        const docRef = await addDoc(collection(db, collectionName), projectData);
        return { id: docRef.id, ...projectData };
    } catch (error) {
        console.error("Create project error:", error);
        throw error;
    }
};

export const updateProject = async (id, projectData) => {
    try {
        const projectRef = doc(db, collectionName, id);
        // Remove id from the update payload if it exists to avoid duplicating the id field inside the document
        const { id: _, ...dataToUpdate } = projectData;

        await updateDoc(projectRef, dataToUpdate);
        return { id, ...projectData };
    } catch (error) {
        console.error("Update project error:", error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return { message: 'Project deleted successfully' };
    } catch (error) {
        console.error("Delete project error:", error);
        throw error;
    }
};
