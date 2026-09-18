
const API_URL =
  `${process.env.REACT_APP_API_URL}/doctors`;

export async function getDoctors() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch doctors. Server returned ${response.status}.`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The server took too long to respond. Please try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}