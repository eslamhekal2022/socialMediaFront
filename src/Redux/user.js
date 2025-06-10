import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRedux(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUserImage: (state, action) => {
      if (state.user) {
        state.user.image = action.payload;
      }
    },

  },
});

export const { updateUserImage,setUserRedux, clearUser } = userSlice.actions;
export default userSlice.reducer;