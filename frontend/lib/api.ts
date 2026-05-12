const API_URL = "http://127.0.0.1:8000";

export async function registerUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return response.json();
}

export async function loginUser(
  email: string,
  password: string
) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: formData,
    }
  );

  return response.json();
}

export async function getApplications(
  token: string
) {
  const response = await fetch(
    `${API_URL}/applications/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function createApplication(
  token: string,
  application: any
) {

  const response = await fetch(
    `${API_URL}/applications/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(application),
    }
  );

  return response.json();
}

export async function updateApplication(
  token: string,
  id: number,
  application: any
) {

  const response = await fetch(
    `${API_URL}/applications/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(application),
    }
  );

  return response.json();
}

export async function deleteApplication(
  token: string,
  id: number
) {

  const response = await fetch(
    `${API_URL}/applications/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}


export async function importApplications(
  token: string,
  file: File
) {

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/applications/import`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  return response.json();
}

export async function getStats(
  token: string
) {

  const response = await fetch(
    "http://127.0.0.1:8000/applications/stats",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}