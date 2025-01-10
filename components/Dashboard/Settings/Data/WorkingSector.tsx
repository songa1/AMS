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
import { Button } from "@mui/material";

function WorkingSector() {
  const toast: any = useRef(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [data, setData] = useState<any>([]);

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
    <div>
      <div className="data-hold">
        <div className="notifications-left">
          <h1 className="noti-sticky-header">Add Working Sector</h1>
          <form className="p-3">
            {error && (
              <p className="bg-red-500 text-white rounded-md text-center p-2 w-full">
                {error}
              </p>
            )}
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Working Sector Name:
            </label>
            <input
              type="text"
              id="name"
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded"
            />

            <Button
              color="primary"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </form>
        </div>
        <div className="notifications-right">
          <div className="noti-sticky-header">Working Sectors</div>
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
        </div>
      </div>
    </div>
  );
}

export default WorkingSector;
