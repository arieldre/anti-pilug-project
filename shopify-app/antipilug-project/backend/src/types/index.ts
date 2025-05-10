export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    // Add other product properties as needed
  }
  
  export interface PlagiarismCheck {
    id: string;
    productId: string;
    status: 'pending' | 'completed' | 'failed';
    result?: {
      similarity: number;
      matchedProducts: string[];
    };
    // Add other plagiarism check properties as needed
  }
  
  export interface PlagiarismResult {
    similarityScore: number;
    matchedUrl: string;
    matchedText: string;
  }