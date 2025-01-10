"use client";

import {
  useAddCohortMutation,
  useCohortsQuery,
  useDeleteCohortMutation,
} from "@/lib/features/otherSlice";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import InputError from "../../../Other/InputError";
import dayjs from "dayjs";
import { FiDelete } from "react-icons/fi";

function Cohorts() {
  const toast: any = useRef(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [data, setData] = useState<any>([]);

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
    try {
      const res = await deleteCohort(id).unwrap();
      if (res) {
        refetch();
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "Cohort deleted successfully!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      try {
        const res = await addCohort({
          name: values?.name,
          description: values?.description,
        }).unwrap();
        if (res && res.status === 400) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: res?.data?.message,
          });
        }
        if (res) {
          console.log(res);
          formik.resetForm();
          refetch();
          toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "Cohort added successfully!",
          });
        }
      } catch (error: any) {
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error?.error || error?.data?.message || error?.data?.error,
        });
      }
    },
  });

  return (
    <div>
      <div className="data-hold">
        <div className="notifications-left">
          <h1 className="noti-sticky-header">Add Cohort</h1>
          <form className="p-3">
            {error && (
              <p className="bg-red-500 text-white rounded-md text-center p-2 w-full">
                {error}
              </p>
            )}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mt-2"
            >
              Cohort Name:
            </label>
            <input
              type="text"
              id="name"
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded"
            />
            {formik.errors.name && formik.touched.name && (
              <InputError error={formik.errors.name} />
            )}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mt-3"
            >
              Description:
            </label>
            <textarea
              rows={5}
              id="name"
              value={formik.values.description}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              required
              className="w-full p-2 mt-1 border rounded"
            />
            {formik.errors.description && formik.touched.description && (
              <InputError error={formik.errors.description} />
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-mainBlue rounded hover:bg-mainblue-700"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
        <div className="notifications-right">
          <div className="noti-sticky-header">Cohorts</div>
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

export default Cohorts;
