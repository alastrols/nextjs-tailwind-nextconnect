import { createReducer } from "@reduxjs/toolkit";
import { getBanner, getBannerById } from "@/features/admin/banner/actions";
import { bannerState } from "@/models/banner.model";

const initialState: bannerState = {
  data: {
    banner_id: "",
    topic: "",
    post_date: "",
    status: "",
    file: "",
    arr: "",
    created_at: "",
  },
  dataEN: {
    banner_id: "",
    topic: "",
    post_date: "",
    status: "",
    file: "",
    arr: "",
    created_at: "",
  },
  dataTH: {
    banner_id: "",
    topic: "",
    post_date: "",
    status: "",
    file: "",
    arr: "",
    created_at: "",
  },
};

export const bannerReducer = createReducer(initialState, (builder) => {
  builder.addCase(getBanner.fulfilled, (state, action) => {
    state.data = action.payload;
  });
  builder.addCase(getBannerById.fulfilled, (state, action) => {
    state.data = action.payload;
  });
});

export default bannerReducer;
