import axios from "axios";
export const axiosInstance = axios.create({
  header: {
    Authorization: `Bearer${localStorage.getItem("token")}`,
  },
});
