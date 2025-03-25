export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  }
  
  export interface PlagiarismCheck {
    id: string;
    productId: string;
    status: 'pending' | 'completed' | 'failed';
    results: PlagiarismResult[];
    createdAt: Date;
  }
  
  export interface PlagiarismResult {
    similarityScore: number;
    matchedUrl: string;
    matchedText: string;
  }