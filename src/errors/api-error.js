export const handleApiError = (error) => {
  if (error.response && error.response.data) {
    throw new Error(error.response.data || "Something went wrong.");
  }

  throw new Error("Server connection error");
};
