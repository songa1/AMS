import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Button from "./Button";
import { useBulkAddUsersMutation } from "@/lib/features/userSlice";

const FullScreenModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  const [data, setData] = useState([]);
  const [savedData, setSavedData] = useState([]);

  const [bulkAddUsers] = useBulkAddUsersMutation();

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
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = e.target.result;

      if (file.type === "text/csv") {
        Papa.parse(data, {
          header: true,
          complete: (results: any) => {
            setData(results.data);
          },
        });
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet: any = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );
        setData(worksheet);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    const goodData = data.map((d: any) => {
      return {
        name: d.name,
        email: d.email,
        phoneNumber: d.phoneNumber,
        gender: d.gender,
        cohortId: d.cohortId,
        companySectorId: d.companySectorId,
      };
    });
    try {
      const res = await bulkAddUsers(goodData).unwrap();
      console.log(savedData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
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
              <div className=" border border-gray-200 rounded-md">
                <div className="w-[90%] mx-auto items-center justify-between flex">
                  <input
                    type="file"
                    className="p-3"
                    onChange={handleFileUpload}
                  />
                  <Button title="Save" onClick={handleSave} />
                </div>
              </div>

              <div className="w-[90%] mx-auto h-[90vh] overflow-scroll no-scrollbar">
                <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
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
