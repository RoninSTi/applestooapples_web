import { createSlice } from '@reduxjs/toolkit';
import api from 'src/utils/api';

const initialState = {
  account: null
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    getAccount(state, action) {
      const { account } = action.payload;

      state.account = account;
    },
    createAccount(state, action) {
      const { account } = action.payload;

      state.account = account;
    },
    deleteAccountUser(state, action) {
      const { account } = action.payload;

      state.account = account
    },
    inviteUser(state, action) {
      const { account } = action.payload

      state.account = account;
    },
    updateAccount(state, action) {
      const { account } = action.payload;

      state.account = account
    }
  }
});

export const reducer = slice.reducer;

export const getAccount = () => async (dispatch) => {
  const response = await api.get(`accounts/me`);

  dispatch(slice.actions.getAccount({ account: response.data }));
};

export const createAccount = (data) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: 'account',
    data
  });

  dispatch(slice.actions.createAccount(response.data));
};

export const deleteAccountUser = ({ accountId, userId }) => async (dispatch) => {
  const response = await api({
    method: 'delete',
    url: `account/${accountId}/user/${userId }`
  });

  dispatch(slice.actions.deleteAccountUser({ account: response.data }))
}

export const inviteUser = (data, accountId) => async dispatch => {
  const response = await api({
    method: 'post',
    url: `account/${accountId}/user/add`,
    data
  })

  dispatch(slice.actions.inviteUser({ account: response.data }))
}

export default slice;
