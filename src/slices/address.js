import { createSlice } from '@reduxjs/toolkit';
import api from 'src/utils/api';

const initialState = {
  addresses: [],
};

const slice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    getAddresses(state, action) {
      const { addresses } = action.payload;

      state.addresses = addresses;
    },
    createAddress(state, action) {
      const { addresses } = action.payload;

      state.addresses = addresses;
    },
    deleteAddress(state, action) {
      const { addresses } = action.payload;

      state.addresses = addresses;
    },
    updateAddress(state, action) {
      const { addresses } = action.payload

      state.addresses = addresses
    }
  }
});

export const reducer = slice.reducer;

export const getAddresses = (accountId) => async (dispatch) => {
  const response = await api.get(`account/${accountId}/addresses`);

  dispatch(slice.actions.getAddresses({ addresses: response.data }));
};

export const createAddress = ({ accountId, data }) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: `account/${accountId}/address`,
    data,
  });

  dispatch(slice.actions.createAddress({ addresses: response.data }));
};

export const deleteAddress = ({ accountId, addressId }) => async dispatch => {
  const response = await api({
    method: 'delete',
    url: `account/${accountId}/address/${addressId}`
  })

  dispatch(slice.actions.deleteAddress({ addresses: response.data }))
}

export const updateAddress = ({ accountId, addressId, data }) => async (dispatch) => {
  const response = await api({
    method: 'put',
    url: `account/${accountId}/address/${addressId}`,
    data
  })

  dispatch(slice.actions.updateAddress({ addresses: response.data }))
}

export default slice;
