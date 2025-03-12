import axios from "axios";

import { handleApiError } from "@/errors";

const signIn = async (data) => {
  try {
    const response = await axios.post("/api/auth/sign-in", data);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

const signUp = async (data) => {
  try {
    const response = await axios.post("/api/auth/sign-up", data);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const AuthApiService = {
  signIn,
  signUp,
}