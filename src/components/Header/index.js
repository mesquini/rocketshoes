import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/img/logo.svg';
import { Container, Cart } from './styles';

export default function Header() {
  const cartSize = useSelector(state => state.cart.length);

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <Cart to="/cart">
        <div>
          <strong>Meu carinho</strong>
          <span>{cartSize} itens</span>
        </div>
        <MdShoppingBasket size={36} color="#fff" />
      </Cart>
    </Container>
  );
}
