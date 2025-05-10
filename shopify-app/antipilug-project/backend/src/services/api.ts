import axios from 'axios';
import { Product, PlagiarismCheck } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data as Product[];
  },

  checkPlagiarism: async (productId: string): Promise<PlagiarismCheck> => {
    const response = await axios.post(`${API_BASE_URL}/plagiarism/check`, { productId });
    return response.data as PlagiarismCheck;
  }
};