import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { User } from "@/types/user";
import Button from "./Button";

const FullScreenExport = ({
  isOpen,
  setIsOpen,
  users,
}: {
  isOpen: boolean;
  setIsOpen: any;
  refetch: any;
  users: User[];
}) => {
  const generatePDF = () => {
    const input: any = document.getElementById("user-list");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("user-list.pdf");
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

  return (
    <div>
      {isOpen &&
        createPortal(
          <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div
              className="modal-overlay absolute w-full h-full bg-white opacity-95"
              onClick={toggleModal}
            ></div>
            <div className="modal-container fixed w-full h-full z-10 overflow-y-auto">
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
                    Export Users
                  </p>
                </div>
                <p className="text-xs">
                  The users list will be exported as a PDF
                </p>
              </div>
              <div className=" border border-gray-200 rounded-md">
                <div className="w-[90%] mx-auto items-center justify-between flex p-2">
                  <div></div>
                  <Button title="Export" onClick={generatePDF} />
                </div>
              </div>
              <div
                id="user-list"
                className="w-[90%] mx-auto h-[90vh] overflow-scroll no-scrollbar p-5"
              >
                <div className="flex flex-col gap-1 justify-center items-center p-2">
                  <div className="font-bold">ALUMNI MANAGEMENT SYSTEM</div>
                  <div>
                    List of All Users on{" "}
                    {new Date().getDate() +
                      "-" +
                      new Date().getMonth() +
                      "-" +
                      new Date().getFullYear()}
                  </div>
                </div>
                <table className="border p-1">
                  <thead className="font-bold">
                    <tr className="border p-1 ">
                      <th className="border p-1 text-start">ID</th>
                      <th className="border p-1 text-start">Name</th>
                      <th className="border p-1 text-start">Email</th>
                      <th className="border p-1 text-start">Phone Number</th>
                      <th className="border p-1 text-start">Role</th>
                      <th className="border p-1 text-start">Gender</th>
                      <th className="border p-1 text-start">
                        Organization Employed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border p-1">
                        <td className="border p-1">{user.id}</td>
                        <td className="border p-1">{`${user.firstName} ${
                          user.middleName || ""
                        } ${user.lastName}`}</td>
                        <td className="border p-1">{user.email}</td>
                        <td className="border p-1">{user.phoneNumber}</td>
                        <td className="border p-1">{user.role.name}</td>
                        <td className="border p-1">{user.gender.name}</td>
                        <td className="border p-1">
                          {user.organizationEmployed.name || "Not Specified"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default FullScreenExport;
