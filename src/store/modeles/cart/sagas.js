import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
// import history from '../../../services/history';

import { formatPrice } from '../../../utils/format';

import { setProductStatus } from '../products/actions';
import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ id }) {
  yield put(setProductStatus(id, true));

  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  try {
    if (amount > stockAmount) {
      toast.error('Requested Amount is Out of Stock!');
      return;
    }

    if (productExists) yield put(updateAmountSuccess(id, amount));
    else {
      const { data } = yield call(api.get, `/products/${id}`);

      const info = {
        ...data,
        amount: 1,
        priceFormatted: formatPrice(data.price),
      };

      yield put(addToCartSuccess(info));

      // history.push('/cart');
    }
  } finally {
    yield put(setProductStatus(id, false));
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error('Product amount not available in stock!');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
