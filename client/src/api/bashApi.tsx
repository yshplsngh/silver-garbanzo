import axios, {AxiosInstance} from "axios";

export const bashApi:AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})