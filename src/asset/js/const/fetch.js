import assign from 'lodash/object/assign';

const COMMON_OPT = {
  // credentials: 'same-origin'
  credentials: 'include'
}
const COMMON_HEADER = {
  'Accept': 'application/json',
}
const FORM_POST_HEADER = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
};


export const POST_OPT = assign({}, COMMON_OPT, {
  method: 'POST',
  headers: assign({}, COMMON_HEADER, FORM_POST_HEADER)
});

export const GET_OPT = assign({}, COMMON_OPT, {
  method: 'GET',
  headers: COMMON_HEADER
});
