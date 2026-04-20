const API_BASE_URL = "http://localhost:5000";

export async function uploadStatement(file: File) {
  const formData = new FormData();
  formData.append("statement", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}

export async function fetchAdvisories(
  userType: "individual" | "sme" | "company"
) {
  const response = await fetch(
    `${API_BASE_URL}/advisory?userType=${userType}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch advisories");
  }

  return data;
}

export async function fetchTaxSummary(
  userType: "individual" | "sme" | "company"
) {
  const response = await fetch(
    `${API_BASE_URL}/tax?userType=${userType}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tax summary");
  }

  return data;
}