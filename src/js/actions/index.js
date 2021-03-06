import fb from '../utils/fb';

export const REQUEST_FETCH_ADSETS = 'REQUEST_FETCH_ADSETS';
export const COMPLETE_FETCH_ADSETS = 'COMPLETE_FETCH_ADSETS';
export const FETCH_ADSETS = 'FETCH_ADSETS';
export const SELECT_ADSET = 'SELECT_ADSET';
export const REQUEST_FETCH_ADACCOUNTS = 'REQUEST_FETCH_ADACCOUNTS';
export const COMPLETE_FETCH_ADACCOUNTS = 'COMPLETE_FETCH_ADACCOUNTS';
export const FETCH_ADACCOUNTS = 'FETCH_ADACCOUNTS';
export const SELECT_ADACCOUNT = 'SELECT_ADACCOUNT';
export const SET_FB_STATUS = 'SET_FB_STATUS';

export const requestFetchAdSets = () => ({ type: REQUEST_FETCH_ADSETS });
export const completeFetchAdSets = () => ({ type: COMPLETE_FETCH_ADSETS });
export const fetchAdSets = (accountId) => {
  return (dispatch) => {
    dispatch(requestFetchAdSets());
    fb.api(`v2.9/${accountId}/adsets`, { fields: 'id,name', limit: 100 }, (response) => {
      dispatch({
        type: FETCH_ADSETS,
        payload: response,
      });
      dispatch(completeFetchAdSets());
    });
  };
};

export const selectAdSet = id => ({
  type: SELECT_ADSET,
  payload: { id },
});

export const requestFetchAdAccounts = () => ({ type: REQUEST_FETCH_ADACCOUNTS });
export const completeFetchAdAccounts = () => ({ type: COMPLETE_FETCH_ADACCOUNTS });
export const fetchAdAccounts = () => (dispatch) => {
  dispatch(requestFetchAdAccounts());
  fb.api('v2.9/me/adaccounts', { fields: 'id,name', limit: 100 }, (response) => {
    dispatch({
      type: FETCH_ADACCOUNTS,
      payload: response,
    });
    dispatch(completeFetchAdAccounts());
  });
};

export const selectAdAccount = (id) => {
  return (dispatch) => {
    dispatch(fetchAdSets(id));
    dispatch({
      type: SELECT_ADACCOUNT,
      payload: { id },
    });
  };
};

export const setFbStatus = (status) => {
  let request = { status };
  if (status === 'connected') {
    request = (dispatch) => {
      fb.api('v2.9/me', { fields: 'id,email,name' }, (response) => {
        const { id, email, name } = response;
        const token = fb.getAccessToken();
        dispatch({
          type: SET_FB_STATUS,
          payload: { status, id, email, name, token },
        });
      });
    };
  }
  return request;
};
