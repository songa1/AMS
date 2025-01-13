"use client";

import {
  useAddWorkingSectorMutation,
  useDeleteWorkingSectorMutation,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { FiDelete } from "react-icons/fi";
import { Alert, Box, Button, TextField } from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";

function WorkingSector() {
  const toast: any = useRef(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [data, setData] = useState<any>([]);
  const [success, setSuccess] = useState("");

  const { data: WorkingSectorData, refetch } = useWorkingSectorQuery("");
  const [addWorkingSector] = useAddWorkingSectorMutation();
  const [deleteWorkingSector] = useDeleteWorkingSectorMutation();

  useEffect(() => {
    if (WorkingSectorData) {
      setData(
        WorkingSectorData?.data
          .map((c: any) => {
            return {
              Name: c?.name,
              CreatedAt: dayjs(c.createdAt).format("DD-MM-YYYY"),
              Action: (
                <button
                  className=" bg-red-600 text-xs p-1 rounded"
                  disabled={c?.name === "Not Specified"}
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleDelete(c.id);
                  }}
                >
                  <FiDelete />
                </button>
              ),
            };
          })
          .sort((a: any, b: any) => a.createdAt - b.createdAt)
      );
    }
  }, [WorkingSectorData]);

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteWorkingSector(id).unwrap();
      if (res) {
        refetch();
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "Working Sector deleted successfully!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      try {
        const res = await addWorkingSector({
          name: values?.name,
        }).unwrap();
        if (res) {
          formik.resetForm();
          refetch();
          toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "Working Sector added successfully!",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Box className="data-hold">
      <Box className="notifications-left">
        <SectionTitle title="Add Working Sector" />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "15px",
          }}
        >
          {error && (
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="filled" severity="success">
              {success}
            </Alert>
          )}
          <TextField
            type="text"
            id="name"
            variant="filled"
            label="Working Sector Name"
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
          />

          <Button
            color="primary"
            disabled={loading}
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </Box>
      </Box>
      <Box className="notifications-right">
        <SectionTitle title="Working Sectors" />
        {/* <DataTable
            value={data}
            tableStyle={{ minWidth: "50rem" }}
            editMode="cell"
          >
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <Column key={key} field={key} header={key}></Column>
              ))}
          </DataTable> */}
      </Box>
    </Box>
  );
}

export default WorkingSector;
