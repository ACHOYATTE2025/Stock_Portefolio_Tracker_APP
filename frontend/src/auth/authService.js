import { data } from "react-router-dom";
import api from "../api/axiosClient";
import { setTokens, clearTokens } from "../utils/tokenStorage";

export const login = async (email, password) => {

  const response = await api.post("/login", {
    email,
    password
  });

  const { accessToken, refreshToken } = response.data;

  setTokens(accessToken, refreshToken);
  console.log("voir data  :", data);
  return response.data;
};

export const logout = () => {
  clearTokens();
};