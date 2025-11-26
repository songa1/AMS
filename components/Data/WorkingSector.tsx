"use client";

import {
  useAddWorkingSectorMutation,
  useDeleteWorkingSectorMutation,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiDelete } from "react-icons/fi";
import { ToastNotification } from "../ui/toast";
import { CustomInputError } from "../ui/input-error";

interface WorkingSectorType {
  id: number;
  name: string;
  createdAt: string;
}

function WorkingSector() {
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [sectorName, setSectorName] = useState("");

  const [formErrors, setFormErrors] = useState<{
    name?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const { data: WorkingSectorData, refetch } = useWorkingSectorQuery("");
  const [addWorkingSector] = useAddWorkingSectorMutation();
  const [deleteWorkingSector] = useDeleteWorkingSectorMutation();

  const handleCloseToast = () => setToast(null);

  useEffect(() => {
    if (WorkingSectorData && WorkingSectorData.data) {
      const processedData = WorkingSectorData.data
        .map((c: WorkingSectorType) => {
          return {
            id: c.id,
            Name: c?.name,
            CreatedAt: dayjs(c.createdAt).format("DD-MM-YYYY"),
            isDefault: c?.name === "Not Specified", // Flag to disable deletion
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        );
      setData(processedData);
    }
  }, [WorkingSectorData]);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteWorkingSector(id).unwrap();

      refetch();
      setToast({
        type: "info",
        message: "Working Sector deleted successfully!",
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      setToast({
        type: "error",
        message:
          error?.data?.message ||
          "Failed to delete working sector. Please check permissions.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom Validation Logic (Replacing Yup)
  const validateForm = () => {
    const errors: { name?: string } = {};
    if (!sectorName.trim()) {
      errors.name = "Working Sector Name is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Custom Submission Logic (Replacing Formik.handleSubmit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ type: "error", message: "Please provide a sector name." });
      return;
    }

    setLoading(true);

    try {
      const res = await addWorkingSector({
        name: sectorName,
      }).unwrap();

      if (res) {
        setSectorName(""); // Reset input
        setFormErrors({});
        refetch();
        setToast({
          type: "success",
          message: "Working Sector added successfully!",
        });
      }
    } catch (error: any) {
      console.error("Add sector error:", error);
      setToast({
        type: "error",
        message:
          error?.data?.message ||
          "Failed to add working sector. It might already exist.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine table headers dynamically
  const tableHeaders =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (key) => key !== "id" && key !== "isDefault"
        )
      : ["Name", "CreatedAt", "Action"];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastNotification
        type={toast?.type || "info"}
        message={toast?.message || ""}
        onClose={handleCloseToast}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Add Working Sector Form */}
        <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Add Working Sector
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Working Sector Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Working Sector Name:
              </label>
              <input
                type="text"
                id="name"
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                required
              />
              <CustomInputError error={formErrors.name} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-4 py-2 mt-4 font-bold text-white rounded-lg transition duration-150 shadow-md ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading || !sectorName.trim()}
            >
              {loading ? "Adding..." : "Add Sector"}
            </button>
          </form>
        </div>

        {/* Right Section: Working Sectors Table */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Working Sectors List
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
                {data.map((sector: any) => (
                  <tr key={sector.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sector.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sector.CreatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className={`p-2 rounded transition duration-150 ${
                          sector.isDefault
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                        disabled={sector.isDefault || loading}
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleDelete(sector.id);
                        }}
                        title={
                          sector.isDefault
                            ? "Cannot delete default sector"
                            : "Delete Working Sector"
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
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500 italic"
                    >
                      No working sectors found.
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

export default WorkingSector;
