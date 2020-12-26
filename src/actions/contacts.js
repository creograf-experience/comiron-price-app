import { getUserContacts } from '../networkers';

export const GET_CONTACTS = 'GET_CONTACTS';

export const fetchContacts = phones => async (dispatch) => {
  try{
    const res = await getUserContacts(phones);

    dispatch({
      type:GET_CONTACTS,
      payload: res,
    })
  } catch (err){
    console.error(err)
  }
}
