const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_THEME_COLOR":
      return {
        ...state,
        newtheme: { ...state.newtheme, mygreen: action.payload },
      };
    case "SET_USER":
      return {
        ...state,
        cuser: action.payload.cuser,
        isuser: action.payload.isuser,
      };

    case "SET_ALL_CHATS":
      return {
        ...state,
        allchats: action.payload,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    case "SET_OTHER_USER":
      return {
        ...state,
        otheruser: action.payload,
      };
    case "SET_ONLINE":
      return {
        ...state,
        isOnline: action.payload,
      };

    case "SET_STORIES":
      return {
        ...state,
        otherstories: action.payload.otherstories,
        mystories: action.payload.mystories,
      };

    case "SET_NEW_VIEWERS":
      return {
        ...state,
        newviewers: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
