// src/services/patientService.js

const API_URL =
  `${process.env.REACT_APP_API_URL}/patients`;

export async function createPatient(patientData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    throw new Error("Failed to create patient.");
  }

  return response.json();
}