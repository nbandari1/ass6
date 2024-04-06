// my-app/lib/userData.js

import { getToken } from './authenticate';

async function makeRequest(url, method = 'GET') {
  const token = getToken();
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function addToFavourites(id) {
  try {
    const response = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, 'PUT');
    return response;
  } catch (error) {
    console.error('Error adding to favourites:', error);
    return [];
  }
}

export async function removeFromFavourites(id) {
  try {
    const response = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, 'DELETE');
    return response;
  } catch (error) {
    console.error('Error removing from favourites:', error);
    return [];
  }
}

export async function getFavourites() {
  try {
    const response = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites`);
    return response;
  } catch (error) {
    console.error('Error getting favourites:', error);
    return [];
  }
}

export async function addToHistory(id) {
  try {
    const response = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, 'PUT');
    return response;
  } catch (error) {
    console.error('Error adding to history:', error);
    return [];
  }
}

export async function removeFromHistory(id) {
  try {
    const response = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, 'DELETE');
    return response;
  } catch (error) {
    console.error('Error removing from history:', error);
    return [];
  }
}

export async function getHistory() {
  try {
    const response = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/history`);
    return response;
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}
