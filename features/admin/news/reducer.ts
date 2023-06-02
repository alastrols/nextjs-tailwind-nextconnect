import { createReducer } from "@reduxjs/toolkit";
import { getNews, getNewsById } from "@/features/admin/news/actions";
import { newsState } from "@/models/news.model";

const initialState: newsState = {
  data: {
    news_id: "",
    topic: "",
    post_date: "",
    status: "",
    detail: "",
    created_at: "",
  },
};

export const newsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getNews.fulfilled, (state, action) => {
    state.data = action.payload;
  });
  builder.addCase(getNewsById.fulfilled, (state, action) => {
    state.data = action.payload;
  });
});

export default newsReducer;
