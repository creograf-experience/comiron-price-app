import { handleActions } from "redux-actions";

import {
  setClients,
  setClientsRequests,
  acceptClient,
  rejectClient,
  deleteClient,
} from "../actions";

const initialState = {
  clients: [],
  clientsRequests: [],
};

export const clients = handleActions(
  {
    [setClients](state, { payload }) {
      return { ...state, clients: payload };
    },

    [setClientsRequests](state, { payload }) {
      return { ...state, clientsRequests: payload };
    },

    [acceptClient](state, { payload }) {
      const updatedClientsRequests = state.clientsRequests.filter(
        client => client.id !== payload.id
      );

      return {
        ...state,
        clientsRequests: updatedClientsRequests
      };
    },

    [rejectClient](state, { payload }) {
      const updatedClientsRequests = state.clientsRequests.filter(
        client => client.id !== payload.id
      );

      return {
        ...state,
        clientsRequests: updatedClientsRequests
      };
    },

    [deleteClient](state, { payload }) {
      const updatedClients = state.clients.filter(
        client => client.id !== payload.id
      );

      return {
        ...state,
        clients: updatedClients
      };
    },
  },
  initialState
);