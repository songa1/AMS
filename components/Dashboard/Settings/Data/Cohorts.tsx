"use client";

import {
  useAddCohortMutation,
  useCohortsQuery,
  useDeleteCohortMutation,
} from "@/lib/features/otherSlice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { FiDelete } from "react-icons/fi";
import { Alert, Box, Button, TextField } from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";

function Cohorts() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [success, setSuccess] = useState("");

  const { data: CohortsData, refetch } = useCohortsQuery("");
  const [addCohort] = useAddCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  useEffect(() => {
    if (CohortsData) {
      setData(
        CohortsData?.data
          .map((c: any) => {
            return {
              Name: c?.name,
              Description: c?.description,
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
  }, [CohortsData]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await deleteCohort(id).unwrap();
      if (res) {
        refetch();
        setSuccess("Cohort deleted successfully!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await addCohort({
          name: values?.name,
          description: values?.description,
        }).unwrap();
        if (res && res.status === 400) {
          setError(res?.data?.message);
        }
        if (res) {
          console.log(res);
          formik.resetForm();
          refetch();
          setSuccess("Cohort added successfully!");
        }
      } catch (error: any) {
        console.log(error);
        setError(error?.error || error?.data?.message || error?.data?.error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box className="data-hold">
      <Box className="notifications-left">
        <SectionTitle title="Add Cohort" />
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
            id="name"
            label="Cohort Name"
            variant="filled"
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
          />

          <TextField
            multiline
            rows={5}
            variant="filled"
            label="Description"
            value={formik.values.description}
            onChange={(e) =>
              formik.setFieldValue("description", e.target.value)
            }
          />

          <Button
            variant="contained"
            color="primary"
            disabled={loading}
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
        <SectionTitle title="Cohorts" />
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

export default Cohorts;
