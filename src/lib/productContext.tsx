'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ProductType = 'akari' | 'fundbuzz';

interface ProductTheme {
  name: string;
  displayName: string;
  logo: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
  };
}

interface ProductContextType {
  currentProduct: ProductType;
  setProduct: (product: ProductType) => void;
  theme: ProductTheme;
}

const themes: Record<ProductType, ProductTheme> = {
  akari: {
    name: 'akari',
    displayName: 'Akari v2',
    logo: '/logo.png',
    colors: {
      background: '#0f172a',
      foreground: '#f8fafc',
      primary: '#ec4899',
      secondary: '#3b82f6',
    },
  },
  fundbuzz: {
    name: 'fundbuzz',
    displayName: 'Bold AI',
    logo: '/fundbuzz-logo.svg',
    colors: {
      background: '#ffffff',
      foreground: '#0f172a',
      primary: '#2563eb',
      secondary: '#1e40af',
    },
  },
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [currentProduct, setCurrentProduct] = useState<ProductType>('fundbuzz');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved product from localStorage
    const saved = localStorage.getItem('selectedProduct') as ProductType;
    if (saved && (saved === 'akari' || saved === 'fundbuzz')) {
      setCurrentProduct(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Save to localStorage
      localStorage.setItem('selectedProduct', currentProduct);

      // Update data attribute on document element
      document.documentElement.setAttribute('data-product', currentProduct);
    }
  }, [currentProduct, mounted]);

  const setProduct = (product: ProductType) => {
    setCurrentProduct(product);
  };

  const value: ProductContextType = {
    currentProduct,
    setProduct,
    theme: themes[currentProduct],
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
