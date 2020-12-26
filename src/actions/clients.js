import { createAction } from 'redux-actions';

export const setClients = createAction("SET_CLIENTS");
export const setClientsRequests = createAction("SET_CLIENTS_REQUESTS");
export const acceptClient = createAction("ACCEPT_CLIENT");
export const rejectClient = createAction("REJECT_CLIENT");
export const deleteClient = createAction("DELETE_CLIENT");