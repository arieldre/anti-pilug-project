import axios from 'axios';
import { Product, PlagiarismCheck } from '../../../backend/src/types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },

  checkPlagiarism: async (productId: string): Promise<PlagiarismCheck> => {
    const response = await axios.post(`${API_BASE_URL}/products/${productId}/check-plagiarism`);
    return response.data;
  }
};