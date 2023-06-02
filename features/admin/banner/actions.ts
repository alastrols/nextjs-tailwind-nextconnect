import { FabProps } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import Router from "next/router";

// Banner JP
export const getBanner = createAsyncThunk(
  "banner/get",
  async (keyword?: string): Promise<any> => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    if (keyword) {
      const response = await axios.get(`${url}/banner/get?keyword=${keyword}`, {
        headers: {
          "access-token": `Bearer ${getCookie("access-token")}`,
        },
      });
      return response.data.data;
    } else {
      const response = await axios.get(`${url}/banner/lists`, {
        headers: {
          "access-token": `Bearer ${getCookie("access-token")}`,
        },
      });
      return response.data.data;
    }
  }
);
export const getBannerById = createAsyncThunk(
  "banner/getbyid",
  async (id?: number): Promise<any> => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    if (id) {
      const response = await axios.get(`${url}/banner/getbyid?id=${id}`, {
        headers: {
          "access-token": `Bearer ${getCookie("access-token")}`,
        },
      });
      return response.data.data;
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async (data: FormData) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    await axios.post(`${url}/banner/delete`, data);
    return { status: "success" };
  }
);

export const deleteAllBanner = createAsyncThunk(
  "banner/alldelete",
  async (id?: any) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    await axios.post(`${url}/banner/deleteall`, { banner_id: id });
    return { status: "success" };
  }
);

export const editBanner = createAsyncThunk(
  "banner/edit",
  async (data: FormData) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    const response = await axios.post(`${url}/banner/edit`, data, {
      headers: {
        "access-token": `Bearer ${getCookie("access-token")}`,
      },
    });
    return response;
  }
);

export const sortableBanner = createAsyncThunk(
  "banner/sortable",
  async (data: any) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    const response = await axios.post(`${url}/banner/sortable`, data);
    return response;
  }
);

// Banner TH
