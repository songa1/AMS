"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Papa from "papaparse";
import Button from "./Button";
import { useBulkAddUsersMutation } from "@/lib/features/userSlice";
import { Toast } from "primereact/toast";

const acceptedCSVTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
];

const FullScreenModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  const [data, setData] = useState<any>([]);
  const [savedData, setSavedData] = useState([]);
  const [bulkAddUsers] = useBulkAddUsersMutation();
  const toast: any = useRef(null);

  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Users added successfully",
    });
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      if (isOpen) {
        toggleModal();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-active");
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.classList.remove("modal-active");
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      complete: function (results) {
        const mappedData = results.data.map((item: any) => {
          return {
            firstName: item["First name"],
            middleName: item["Middle Name"],
            lastName: item["Second name"],
            email: item["Email Address"],
            phoneNumber: item["Your personal Phone number"],
            whatsappNumber: item["Your WhatsApp number"],
            genderName: item["Gender"],
            track: item["Track"],
          };
        });
        setData(mappedData);
      },
    });
  };

  const handleSave = async () => {
    try {
      const res = await bulkAddUsers({ users: data }).unwrap();
      if (res.status === 201) {
        setIsOpen(!isOpen);
        show();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      {isOpen &&
        createPortal(
          <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div
              className="modal-overlay absolute w-full h-full bg-white opacity-95"
              onClick={toggleModal}
            ></div>

            <div className="modal-container fixed w-full h-full z-50 overflow-y-auto">
              <div
                className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-black text-sm z-50"
                onClick={toggleModal}
              >
                <svg
                  className="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
                (Esc)
              </div>

              <div className="modal-content container mx-auto h-auto text-left p-4">
                <div className="flex justify-between items-center pb-2">
                  <p className="text-2xl font-bold text-mainBlue">
                    Upload Users
                  </p>
                </div>
                <p className="text-xs">Use Excel or CSV file</p>
              </div>
              <div className="border border-gray-200 rounded-md">
                <div className="w-[90%] mx-auto items-center justify-between flex">
                  <input
                    type="file"
                    className="p-3"
                    onChange={handleFileUpload}
                    accept={acceptedCSVTypes.join(",")}
                  />
                  <Button title="Save" onClick={handleSave} />
                </div>
              </div>

              <div className="w-[90%] mx-auto h-[90vh] overflow-scroll no-scrollbar">
                <DataTable
                  value={data}
                  tableStyle={{ minWidth: "50rem" }}
                  editMode="cell"
                >
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <Column key={key} field={key} header={key}></Column>
                    ))}
                </DataTable>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default FullScreenModal;
