import Cookies from "react-cookies";
import { callApi } from "../commonApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.load("apiToken");

export const getGigWorkerAadharVerifiedDetailsAPI = async () => {
  try {
    const aid = Cookies.load("aid");

    return await callApi("getGigWorkerAadharVerifiedDetails", {
      application_id: aid,
    });

  } catch (error) {
    console.error("Error Info:", error);
    throw error;
  }
};
