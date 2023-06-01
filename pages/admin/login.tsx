import React from "react";

//Sweetalert
import Swal from "sweetalert2";

//React Hook Form
import { Controller, useForm } from "react-hook-form";
//Yup
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//MUI
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";

type Props = {};

interface User {
  username: string;
  password: string;
}

const Login = ({}: Props) => {
  const errorColor = red[500];
  const defaultValue: User = { username: "", password: "" };
  const formValidateSchema = Yup.object().shape({
    // username: Yup.string()
    //   .required("Username is required")
    //   .email("Must be email format")
    //   .trim(),
    // password: Yup.string().required("Password is required").min(8).trim(),
    username: Yup.string().required("Username is required").trim(),
    password: Yup.string().required("Password is required").trim(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: defaultValue,
    resolver: yupResolver(formValidateSchema),
  });

  const onSubmit = async (data: User) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      const URL = process.env.NEXT_PUBLIC_BASE_URL_API;
      await fetch(`${URL}/auth/login`, {
        method: "POST",
        body: formData,
      })
        .then(async (rawResponse) => {
          rawResponse.json().then((data) => {
            if (data.status == "success") {
              Swal.fire("Success!", "", "success").then(function () {
                location.reload();
              });
              return false;
            } else {
              console.log(data);
            }
          });
        })
        .catch((error) => {
          Swal.fire("Error!", "", "error").then(function () {
            return false;
          });
          return false;
        });
    } catch (e) {
      console.log("error!");
    }
  };

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      display="flex"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: 500 }}
        autoComplete="off"
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Back-End Login
        </Typography>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="username"
              label="Username"
              type="text"
              fullWidth
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          name="username"
          control={control}
          defaultValue=""
        />
        {errors.username?.message && (
          <Typography sx={{ color: errorColor }}>
            {errors.username?.message}
          </Typography>
        )}

        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="password"
              label="Password"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              autoComplete="new-password"
              sx={{ marginTop: "10px" }}
            />
          )}
          name="password"
          control={control}
          defaultValue=""
        />
        {errors.password?.message && (
          <Typography sx={{ color: errorColor }}>
            {errors.password?.message}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          sx={{ marginTop: "10px" }}
          fullWidth
          type="submit"
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
