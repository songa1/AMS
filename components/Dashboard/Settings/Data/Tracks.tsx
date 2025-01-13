"use client";

import {
  useAddTrackMutation,
  useDeleteTrackMutation,
  useTracksQuery,
} from "@/lib/features/otherSlice";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Alert, Box, Button, TextField } from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";

function Tracks() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [success, setSuccess] = useState("");

  const { data: TracksData, refetch } = useTracksQuery("");
  const [addTrack] = useAddTrackMutation();
  const [deleteTrack] = useDeleteTrackMutation();

  useEffect(() => {
    setLoading(true);
    if (TracksData) {
      setData(
        TracksData?.data
          .map((c: any) => {
            return {
              id: c?.id,
              Name: c?.name,
              CreatedAt: dayjs(c.createdAt).format("DD-MM-YYYY"),
            };
          })
          .sort((a: any, b: any) => a.createdAt - b.createdAt)
      );
    }
    setLoading(false);
  }, [TracksData]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await deleteTrack(id).unwrap();
      if (res) {
        refetch();
        setSuccess("Track deleted successfully!");
      }
    } catch (error: any) {
      console.log(error);
      setError(error?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
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
      createdAt: item?.CreatedAt,
    };
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await addTrack({
          name: values?.name,
        }).unwrap();
        if (res) {
          formik.resetForm();
          refetch();
          setSuccess("Track added successfully!");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box className="data-hold">
      <Box className="notifications-left">
        <SectionTitle title="Add Track" />
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
            label="Track Name"
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
          />
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
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
        <SectionTitle title="Tracks" />
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
          sx={(theme: any) => ({
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

export default Tracks;
