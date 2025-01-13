"use client";

import {
  useAddTrackMutation,
  useDeleteTrackMutation,
  useTracksQuery,
} from "@/lib/features/otherSlice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { FiDelete } from "react-icons/fi";
import { Alert, Box, Button, TextField } from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";

function Tracks() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [success, setSuccess] = useState("");

  const { data: TracksData, refetch } = useTracksQuery("");
  const [addTrack] = useAddTrackMutation();
  const [deleteTrack] = useDeleteTrackMutation();

  useEffect(() => {
    if (TracksData) {
      setData(
        TracksData?.data
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

export default Tracks;
