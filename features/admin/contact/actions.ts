import { FabProps } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import Router from "next/router";

export const getContact = createAsyncThunk(
  "contact/get",
  async (keyword?: string): Promise<any> => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    if (keyword) {
      const response = await axios.get(`${url}/contact/get?keyword=${keyword}`);
      return response.data.data;
    } else {
      const response = await axios.get(`${url}/contact/lists`);
      console.log(response.data);
      return response.data.data;
    }
  }
);
export const getContactById = createAsyncThunk(
  "contact/getbyid",
  async (id?: number): Promise<any> => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    if (id) {
      const response = await axios.get(`${url}/contact/getbyid?id=${id}`);
      return response.data.data;
    }
  }
);
export const addContact = createAsyncThunk(
  "contact/add",
  async (data: FormData) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    const response = await axios.post(`${url}/contact/add`, data);
    return response;
  }
);

export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (data: FormData) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    await axios.post(`${url}/contact/delete`, data);
    return { status: "success" };
  }
);

export const deleteAllContact = createAsyncThunk(
  "contact/alldelete",
  async (id?: any) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    await axios.post(`${url}/contact/deleteall`, { contact_id: id });
    return { status: "success" };
  }
);

export const editContact = createAsyncThunk(
  "contact/edit",
  async (data: FormData) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    const response = await axios.post(`${url}/contact/edit`, data);
    return response;
  }
);

export const uploadContact = createAsyncThunk(
  "contact/upload",
  async (data: FormData) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL_API;
    const response = await axios.post(`${url}/contact/upload`, data, {
      headers: {
        "access-token": `Bearer ${getCookie("access-token")}`,
      },
    });
    return response;
  }
);
