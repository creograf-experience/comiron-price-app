import { handleActions } from "redux-actions";

import { setGroups, saveGroup } from "../screens/GroupScreen/actions";
import { clearGroups } from "../screens/ShopInfoScreen/actions";

const initialState = {
  groups: [],
};

export const groups = handleActions(
  {
    [setGroups](state, { payload }) {
      const payloadFilter = payload.groups.map(group => group.id);
      const groupsFiltered = state.groups.filter(group => !payloadFilter.includes(String(group.id)));
      return { ...state, groups: groupsFiltered.concat(payload.groups)};
    },
    [saveGroup](state, { payload }) {
      const groupIndex = state.groups.findIndex(el => el.id === payload.id);
      const groups = state.groups;
      groups.splice(groupIndex, 1, payload);
      return { ...state, groups };
    },
    [clearGroups](state) {
      return { ...state, groups: [] };
    },
  },
  initialState
);
