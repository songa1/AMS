"use client";

import {
  useAddCohortMutation,
  useCohortsQuery,
  useDeleteCohortMutation,
} from "@/lib/features/otherSlice";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Alert, Box, Button, TextField } from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

function Cohorts() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [success, setSuccess] = useState("");

  const { data: CohortsData, refetch } = useCohortsQuery("");
  const [addCohort] = useAddCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  useEffect(() => {
    setLoading(true);
    if (CohortsData) {
      setData(
        CohortsData?.data
          .map((c: any) => {
            return {
              id: c?.id,
              Name: c?.name,
              Description: c?.description,
              CreatedAt: dayjs(c.createdAt).format("DD-MM-YYYY"),
            };
          })
          .sort((a: any, b: any) => a.createdAt - b.createdAt)
      );
    }
    setLoading(false);
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

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "createdAt", headerName: "Created When", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: (params: GridRowParams<any>) => {
        const id: any = params.id;
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={async (e) => {
              e.preventDefault();
              handleDelete(id);
            }}
            color="inherit"
            key="delete"
          />,
        ];
      },
    },
  ];

  const rows = data.map((item: any) => {
    return {
      id: item.id,
      name: item?.Name,
      description: item?.Description,
      createdAt: item?.CreatedAt,
    };
  });

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
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          sx={(theme) => ({
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[700]
                : theme.palette.grey[200],
            "& .MuiDataGrid-cell": {
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[200],
            },
          })}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </Box>
    </Box>
  );
}

export default Cohorts;
