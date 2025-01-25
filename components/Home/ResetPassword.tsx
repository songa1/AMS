"use client";

import Header from "@/components/Home/Header";
import { useResetPasswordMutation } from "@/lib/features/authSlice";
import {
  Alert,
  Box,
  Button,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ResetPassword = () => {
  const { tokendata } = useParams<{ tokendata: string }>();

  const decodedData = decodeURIComponent(tokendata);

  const [token, email] = decodedData.split("+email+");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [resetPassword] = useResetPasswordMutation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      cPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
      cPassword: Yup.string()
        .required("Kindly repeat the new password!")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      if (formik.errors.password || formik.errors.cPassword) {
        setError(
          `Please correct these problems: ${formik.errors.password || formik.errors.cPassword}`
        );
        return;
      }
      setIsLoading(true);
      try {
        const result = await resetPassword({
          token,
          newPassword: values.password,
        }).unwrap();

        formik.resetForm();
        setSuccess(result.message);
      } catch (err: any) {
        console.error("Failed to reset:", err);
        if (err?.status === 401) {
          setError(err?.data?.error);
        } else {
          setError("Reset Failed! Try again, or contact the administrator!");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Box className="w-full h-screen flex flex-col md:flex-row">
      <Box
        className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center"
        style={{ backgroundImage: `url('/yali_alumni.jpg')` }}
      ></Box>
      <Box className="w-full md:w-1/2 h-full p-8 md:p-20 flex items-center justify-center">
        {success && (
          <Box className="flex flex-col gap-3 justify-center items-center">
            <Alert severity="success" variant="filled" className="my-2">
              {success}
            </Alert>
            <Link href="/" className="underline">
              <Typography variant="subtitle1" color="primary">
                Go to Login
              </Typography>
            </Link>
          </Box>
        )}
        {!success && (
          <form className="mt-4 space-y-6">
            <Header />
            <Typography
              fontWeight={600}
              variant="h6"
              className="text-center text-mainBlue m-0"
            >
              Change your Password
            </Typography>
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <TextField
                label="Email/Username"
                type="email"
                value={email}
                defaultValue={email}
                disabled
                variant="filled"
              />
              <FormControl>
                <InputLabel>New Password:</InputLabel>
                <FilledInput
                  type={showPassword ? "text" : "password"}
                  error={formik.errors.password ? true : false}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  value={formik.values.password}
                  onChange={(e) =>
                    formik.setFieldValue("password", e.target.value)
                  }
                  required
                  placeholder="Enter the new password"
                />
                <FormHelperText>{formik.errors.password}</FormHelperText>
              </FormControl>
              <TextField
                label="Repeat Password:"
                type="password"
                value={formik.values.cPassword}
                onChange={(e) =>
                  formik.setFieldValue("cPassword", e.target.value)
                }
                required
                variant="filled"
                placeholder="Repeat the new password"
                error={formik.errors.cPassword ? true : false}
                helperText={formik.errors.cPassword}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full mt-2"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ResetPassword;
