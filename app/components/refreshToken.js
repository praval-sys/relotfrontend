import axios from "axios";
import { setToken } from "../redux/reducer/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

//const dispatch = useDispatch();
const refreshTokenFunc = async () => {
  try {
    const res = await axios.post(
      "http://localhost:3000/auth/refresh-token",
      {},
      {
        withCredentials: true,
      }
    );
    return res.data.accessToken;
  } catch (error) {
    console.log(error, "error in refreshTokenFunction");
  }
};

export const checkTime = async (remTime) => {
  if (remTime > Date.now()) {
    console.log("this much time is left:", remTime - Date.now());
  } else {
    try {
      const newAccessToken = await refreshTokenFunc();
      return newAccessToken
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }
};
