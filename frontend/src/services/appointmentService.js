// src/services/appointmentService.js

const API_URL =
  `${process.env.REACT_APP_API_URL}/appointments`;

export async function createAppointment(appointmentData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create appointment.");
  }

  return response.json();
}