import axios from "axios";

const myaxios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const MYSECRETPASSPHRASE = process.env.REACT_APP_MYSECRETPASSPHRASE;
export const FIREBASE_NOTIFICATION_KEY =
  process.env.REACT_APP_FIREBASE_NOTIFICATION_KEY;

export default myaxios;
