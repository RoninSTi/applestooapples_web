import { createSlice } from '@reduxjs/toolkit';
import api from 'src/utils/api';

const initialState = {
  accounts: [],
  activeAccount: null
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    getAccount(state, action) {
      const { account } = action.payload;

      state.activeAccount = account;
    },
    getAccounts(state, action) {
      const { accounts } = action.payload;

      state.accounts = accounts

      if (!state.activeAccount) {
        state.activeAccount = accounts[0]
      } else {
        const updatedActiveAccount = accounts.find(account => account.id === state.activeAccount.id)

        state.activeAccount = updatedActiveAccount
      }
    },
    createAccount(state, action) {
      const { account } = action.payload;

      state.activeAccount = account;
    },
    inviteUser(state, action) {
      const { account } = action.payload

      state.accounts = state.accounts.map(existingAccount => existingAccount.id === account.id ? account : existingAccount)

      state.activeAccount = account;
    },
    updateAccount(state, action) {
      const { account } = action.payload;

      state.activeAccount = account
    }
  }
});

export const reducer = slice.reducer;

export const getAccount = (id) => async (dispatch) => {
  const response = await api.get(`account/${id}`);

  dispatch(slice.actions.getAccount({ account: response.data }));
};

export const getAccounts = () => async (dispatch) => {
  const response = await api.get(`accounts/me`);

  dispatch(slice.actions.getAccounts({ accounts: response.data }));
};

export const createAccount = (data) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: 'account',
    data
  });

  dispatch(slice.actions.createEvent(response.data));
};

export const inviteUser = (data, accountId) => async dispatch => {
  const response = await api({
    method: 'post',
    url: `account/${accountId}/user/add`,
    data
  })

  dispatch(slice.actions.inviteUser({ account: response.data }))
}

export default slice;
