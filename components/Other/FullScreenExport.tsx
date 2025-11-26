import { User } from "@/types/user";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CustomButton } from "../ui/button1";

const FullScreenExport = ({
  isOpen,
  setIsOpen,
  users = [],
}: {
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
  users: User[];
}) => {
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error" | "info";
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showNotification = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setNotification({ message, severity });
    setTimeout(() => setNotification(null), 3000);
  };

  const show = () => {
    showNotification("Users added successfully", "success");
  };

  const generatePDF = async () => {
    setIsExporting(true);
    const input = document.getElementById("user-list-content");

    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`user-list-${new Date().toISOString().slice(0, 10)}.pdf`);
      showNotification("PDF successfully generated!", "success");
    } catch (error) {
      console.error("PDF generation failed:", error);
      showNotification(
        "Failed to generate PDF. Check console for details.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const toggleModal = () => {
    if (!isExporting) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event: { key: string; keyCode: number }) => {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      if (isOpen) {
        toggleModal();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isExporting]); // Added isExporting to dependencies for safety

  // Render nothing if not open
  // if (!isOpen) {
  //   return (
  //     <ToastNotification
  //       type={notification?.severity}
  //       message={notification?.message}
  //       onClose={setIsOpen}
  //     />
  //   );
  // }

  // Modal content rendered via Portal
  return (
    <>
      {/* <ToastNotification
        message={notification?.message ?? ""}
        type={notification?.severity ?? "info"}
      /> */}
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="modal-overlay absolute inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleModal}
          ></div>

          <div className="modal-container fixed inset-0 flex flex-col max-w-7xl mx-auto my-4 bg-white rounded-xl shadow-2xl transform transition-all duration-300 overflow-hidden">
            <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-indigo-700">
                  Export Users
                </h2>
                <p className="text-sm text-gray-500">
                  Preview of the user list to be exported as a multi-page PDF.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <CustomButton onClick={generatePDF} disabled={isExporting}>
                  {isExporting ? "Generating..." : "Export to PDF"}
                </CustomButton>
                <button
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-150"
                  onClick={toggleModal}
                  disabled={isExporting}
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-xs block mt-[-4px]">(Esc)</span>
                </button>
              </div>
            </div>

            {/* Content Area (Scrollable PDF Preview) */}
            <div
              className="flex-grow overflow-y-auto bg-white p-4 sm:p-6"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <div
                id="user-list-content"
                className="w-full max-w-4xl mx-auto p-8 bg-white shadow-xl min-h-[297mm] transition-shadow duration-300 border border-gray-300"
                style={{ minHeight: "297mm", width: "210mm" }} // Enforce A4 dimensions for preview accuracy
              >
                {/* PDF Header Content */}
                <div className="text-center mb-8 border-b-2 border-indigo-200 pb-4">
                  <div className="text-2xl font-extrabold text-indigo-800">
                    ALUMNI MANAGEMENT SYSTEM
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    List of All Users | Report Date:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* User Table */}
                <table className="w-full table-fixed text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-50 border-b border-indigo-200 text-indigo-700 uppercase font-bold tracking-wider">
                      <th className="w-1/12 py-3 px-2 text-left border-r border-indigo-200">
                        ID
                      </th>
                      <th className="w-2/12 py-3 px-2 text-left border-r border-indigo-200">
                        Name
                      </th>
                      <th className="w-2/12 py-3 px-2 text-left border-r border-indigo-200">
                        Email
                      </th>
                      <th className="w-2/12 py-3 px-2 text-left border-r border-indigo-200">
                        Phone
                      </th>
                      <th className="w-1/12 py-3 px-2 text-left border-r border-indigo-200">
                        Role
                      </th>
                      <th className="w-1/12 py-3 px-2 text-left border-r border-indigo-200">
                        Gender
                      </th>
                      <th className="w-3/12 py-3 px-2 text-left">
                        Organization Employed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr
                          key={user.id || index}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <td className="py-2 px-2 text-left text-gray-700">
                            {user.id}
                          </td>
                          <td className="py-2 px-2 text-left text-gray-700 truncate">{`${user.firstName} ${user.middleName || ""} ${user.lastName}`}</td>
                          <td className="py-2 px-2 text-left text-gray-700 truncate">
                            {user.email}
                          </td>
                          <td className="py-2 px-2 text-left text-gray-700">
                            {user.phoneNumber}
                          </td>
                          <td className="py-2 px-2 text-left text-gray-700">
                            {user.role?.name}
                          </td>
                          <td className="py-2 px-2 text-left text-gray-700">
                            {user.gender?.name}
                          </td>
                          <td className="py-2 px-2 text-left text-gray-700 truncate">
                            {user.organizationEmployed?.name || "Not Specified"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-lg text-gray-500"
                        >
                          No user data available to export.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FullScreenExport;
