import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => Promise<void>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}`);
      
      const existProduct = cart.find(product => product.id === productId);
      
      if(existProduct){
        updateProductAmount({productId, amount: existProduct.amount + 1 })
      }
      else {
        const newProduct = {...response.data, amount: 1};
  
        const newCart = [...cart, newProduct];
  
        setCart(newCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      }      

      toast.success('Novo produto adicionado no carrinho!')
      
    } catch(error: any) {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      if(!cart.find(product => product.id === productId))
        throw new Error('Erro na remoção do produto')

      if(!cart.find(product => product.id === productId))
        throw new Error('Erro na alteração de quantidade do produto')

      const filteredProduct = cart.filter(c => c.id !== productId)

      setCart(filteredProduct)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(filteredProduct))

      toast.info('Produto removido!')
    } catch(error: any) {
      toast.error(error.message)
    }
  };

  async function updateProductAmount ({
    productId,
    amount,
  }: UpdateProductAmount) {
    try {
      if(amount === 0) throw new Error('Não pode ser menor que 1');

      if(!cart.find(product => product.id === productId))
        throw new Error('Erro na alteração de quantidade do produto')

      const response = await api.get<Stock>(`/stock/${productId}`);        

      if(amount > response.data.amount)        
        throw new Error('Quantidade solicitada fora de estoque')         
      

      const newCart = cart.map(product => {
        if(product.id === productId) {
          product.amount = amount;
        }

        return product
      });

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      setCart(newCart);
    } catch(error: any) {
      toast.error(error.message)
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
