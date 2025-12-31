import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: {
    RTIS: null,
    SNT: null,
    FSD: null,
    CMS: null,
  },
  uploadStatus: {
    RTIS: null,
    SNT: null,
    FSD: null,
    CMS: null,
  },
  uploadedData: {
    RTIS: null,
    SNT: null,
    FSD: null,
    CMS: null,
  },
};

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    setFile: (state, action) => {
      const { fieldName, file } = action.payload;
      state.files[fieldName] = file;
    },
    setUploadStatus: (state, action) => {
      const { fieldName, status } = action.payload;
      state.uploadStatus[fieldName] = status;
    },
    setUploadedData: (state, action) => {
      const { fieldName, data } = action.payload;
      state.uploadedData[fieldName] = data;
    },
    clearAllFiles: (state) => {
      state.files = {
        RTIS: null,
        SNT: null,
        FSD: null,
        CMS: null,
      };
      state.uploadStatus = {
        RTIS: null,
        SNT: null,
        FSD: null,
        CMS: null,
      };
      state.uploadedData = {
        RTIS: null,
        SNT: null,
        FSD: null,
        CMS: null,
      };
    },
    loadFromLocalStorage: (state, action) => {
      const savedState = action.payload;
      if (savedState) {
        state.files = savedState.files || initialState.files;
        state.uploadStatus = savedState.uploadStatus || initialState.uploadStatus;
        state.uploadedData = savedState.uploadedData || initialState.uploadedData;
      }
    },
  },
});

export const { setFile, setUploadStatus, setUploadedData, clearAllFiles, loadFromLocalStorage } =
  uploadsSlice.actions;
export default uploadsSlice.reducer;
