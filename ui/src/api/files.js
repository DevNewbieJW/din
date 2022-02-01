const defaultApi = "http://localhost:5000";

export const getFileList = async () => {
  const response = await fetch(`${defaultApi}/`);

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  return response.json();
};

export const openFileById = async (id) => {
  const response = await fetch(`${defaultApi}/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  return response.json();
};

export const getImageById = async (id) => {
  const response = await fetch(`${defaultApi}/${id}/image`);

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  return response.text();
};
