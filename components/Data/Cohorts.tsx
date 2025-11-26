"use client";

import {
  useAddCohortMutation,
  useCohortsQuery,
  useDeleteCohortMutation,
} from "@/lib/features/otherSlice";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiDelete } from "react-icons/fi";
import { ToastNotification } from "../ui/toast";
import { CustomInputError } from "../ui/input-error";

interface CohortType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

function Cohorts() {
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [cohortName, setCohortName] = useState("");
  const [cohortDescription, setCohortDescription] = useState("");

  // Validation error state replacement for Formik.errors
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const { data: CohortsData, refetch } = useCohortsQuery("");
  const [addCohort] = useAddCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  const handleCloseToast = () => setToast(null);

  useEffect(() => {
    if (CohortsData && CohortsData.data) {
      // Mapping logic remains similar, but directly uses the API data structure
      const processedData = CohortsData.data
        .map((c: CohortType) => {
          return {
            id: c.id,
            Name: c?.name,
            Description: c?.description,
            CreatedAt: dayjs(c.createdAt).format("DD-MM-YYYY"),
            isDefault: c?.name === "Not Specified", // Use a flag for easy check
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        );
      setData(processedData);
    }
  }, [CohortsData]);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteCohort(id).unwrap();

      refetch();
      setToast({
        type: "info",
        message: "Cohort deleted successfully!",
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      setToast({
        type: "error",
        message:
          error?.data?.message ||
          "Failed to delete cohort. Please check permissions.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom Validation Logic (Replacing Yup)
  const validateForm = () => {
    const errors: { name?: string; description?: string } = {};
    if (!cohortName.trim()) {
      errors.name = "Cohort Name is required.";
    }
    if (!cohortDescription.trim()) {
      errors.description = "Description is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Custom Submission Logic (Replacing Formik.handleSubmit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({
        type: "error",
        message: "Please fix the errors in the form.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await addCohort({
        name: cohortName,
        description: cohortDescription,
      }).unwrap();

      // Check for specific API error response structure
      if (res && res.status === 400) {
        setToast({
          type: "error",
          message: res?.data?.message || "Error adding cohort.",
        });
        return;
      }

      // Success case
      setCohortName("");
      setCohortDescription("");
      setFormErrors({});
      refetch();
      setToast({
        type: "success",
        message: "Cohort added successfully!",
      });
    } catch (error: any) {
      console.error("Add cohort error:", error);
      setToast({
        type: "error",
        message: error?.data?.message || "Failed to add cohort.",
      });
    } finally {
      setLoading(false);
    }
  };

  const tableHeaders =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (key) => key !== "id" && key !== "isDefault"
        )
      : ["Name", "Description", "CreatedAt", "Action"];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastNotification
        type={toast?.type || "info"}
        message={toast?.message || ""}
        onClose={handleCloseToast}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Add Cohort Form */}
        <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Add Cohort
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cohort Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cohort Name:
              </label>
              <input
                type="text"
                id="name"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                required
              />
              <CustomInputError error={formErrors.name} />
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description:
              </label>
              <textarea
                rows={4}
                id="description"
                value={cohortDescription}
                onChange={(e) => setCohortDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none"
                required
              />
              <CustomInputError error={formErrors.description} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-4 py-2 mt-4 font-bold text-white rounded-lg transition duration-150 shadow-md ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Cohort"}
            </button>
          </form>
        </div>

        {/* Right Section: Cohorts Table */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Cohorts List
          </h1>

          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((cohort: any) => (
                  <tr key={cohort.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cohort.Name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden truncate">
                      {cohort.Description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cohort.CreatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className={`p-2 rounded transition duration-150 ${
                          cohort.isDefault
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                        disabled={cohort.isDefault || loading}
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleDelete(cohort.id);
                        }}
                        title={
                          cohort.isDefault
                            ? "Cannot delete default cohort"
                            : "Delete Cohort"
                        }
                      >
                        <FiDelete className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500 italic"
                    >
                      No cohorts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cohorts;
