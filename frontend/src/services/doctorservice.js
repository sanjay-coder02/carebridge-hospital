// src/services/doctorService.js

const API_URL =
  `${process.env.REACT_APP_API_URL}/doctors`;

export async function getDoctors() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch doctors.");
  }

  return response.json();
}