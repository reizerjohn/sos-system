import axios, { AxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  baseURL: `/api`,
  responseType: 'json',
};

const axiosDownloadConfig: AxiosRequestConfig = {
  baseURL: `/api`,
  responseType: 'blob',
};

export const clientApi = axios.create(axiosConfig);
export const clientDownloadApi = axios.create(axiosDownloadConfig);