import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import { formatPrice } from '../../utils/format';
import api from '../../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/products');
      const format = data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));
      setProducts(format);
    }
    load();
  }, []);

  return (
    <ProductList>
      {products &&
        products.map(p => (
          <li key={p.id}>
            <img src={p.image} alt="tenis" />
            <strong>{p.title}</strong>
            <span>{p.priceFormatted}</span>

            <button type="button">
              <div>
                <MdAddShoppingCart size={16} color="#fff" /> 3
              </div>

              <span>ADICIONAR AO CARRINHOS</span>
            </button>
          </li>
        ))}
    </ProductList>
  );
}
