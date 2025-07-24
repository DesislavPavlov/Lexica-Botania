import type { Flower } from '../types/Flower';
import { getJWT } from './supabaseService';

const API_URL = import.meta.env.VITE_API_URL;
let jwt: string | undefined = '';

async function setJWT() {
    jwt = await getJWT();
}
  
async function submitSuggestion(data: FormData): Promise<boolean> {
    await setJWT();
    const res = await fetch(`${API_URL}/flower-suggestions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        body: data,
    });

    return res.ok;
}

async function submitFlower(data: FormData): Promise<boolean> {
    await setJWT();
    const res = await fetch(`${API_URL}/flowers`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        body: data,
    });

    return res.ok;
}

async function getFlowers(): Promise<Flower[]> {
    await setJWT();
    const res = await fetch(`${API_URL}/flowers`, {
        method: 'GET', 
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    if (!res.ok) {
        return [];
    } 

    return res.json();
}

async function getSuggestions(): Promise<Flower[]> {
    await setJWT();
    const res = await fetch(`${API_URL}/flower-suggestions`, {
        method: 'GET', 
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    if (!res.ok) {
        return [];
    } 

    return res.json();
}

async function deleteFlower(id: string) {
    await setJWT();
    const res = await fetch(`${API_URL}/flowers?id=${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    return res.ok;
}

async function deleteSuggestion(id: string) {
    await setJWT();
    const res = await fetch(`${API_URL}/flower-suggestions?id=${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    return res.ok;
}

async function approveSuggestion(id: string) {
    await setJWT();
    const res = await fetch(`${API_URL}/flower-suggestions/approve?id=${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    return res.ok;
}

export { submitSuggestion, submitFlower, getFlowers, getSuggestions, deleteFlower, deleteSuggestion, approveSuggestion };