import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import { formatPrice } from '../../utils/format';
import api from '../../services/api';

import * as CartActions from '../../store/modeles/cart/actions';

function Home({ amount, addToCartRequest }) {
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

  function handleAddProduct(id) {
    addToCartRequest(id);
  }

  return (
    <ProductList>
      {products &&
        products.map(p => (
          <li key={p.id}>
            <img src={p.image} alt="tenis" />
            <strong>{p.title}</strong>
            <span>{p.priceFormatted}</span>

            <button type="button" onClick={() => handleAddProduct(p.id)}>
              <div>
                <MdAddShoppingCart size={16} color="#fff" /> {amount[p.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHOS</span>
            </button>
          </li>
        ))}
    </ProductList>
  );
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
