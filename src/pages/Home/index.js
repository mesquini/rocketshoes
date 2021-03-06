import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import { formatPrice } from '../../utils/format';

import GridPlaceHolder from '../../components/GridPlaceHolder';

import api from '../../services/api';

import * as CartActions from '../../store/modeles/cart/actions';
import * as ProductActions from '../../store/modeles/products/actions';

export default function Home() {
  const products = useSelector(state => state.products);
  const amount = useSelector(state =>
    state.cart.reduce((amount, product) => {
      amount[product.id] = product.amount;

      return amount;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/products');
      const format = data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
        loading: false,
      }));

      dispatch(ProductActions.storeProducts(format));
    }
    load();
  }, [dispatch]);

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
  }

  return (
    <ProductList>
      {products === null ? (
        <GridPlaceHolder repeatCount={6} />
      ) : (
        products.map(p => (
          <li key={p.id}>
            <img src={p.image} alt="tenis" />
            <strong>{p.title}</strong>
            <span>{p.priceFormatted}</span>

            <button type="button" onClick={() => handleAddProduct(p.id)}>
              {p.loading ? (
                <Loader type="Oval" color="#FFF" height={16} width={24} />
              ) : (
                <div>
                  <MdAddShoppingCart size={16} color="#fff" />{' '}
                  {amount[p.id] || 0}
                </div>
              )}
              <span>ADICIONAR AO CARRINHOS</span>
            </button>
          </li>
        ))
      )}
    </ProductList>
  );
}
