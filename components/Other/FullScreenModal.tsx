"use client";

import React, { useEffect, useState } from "react";
import { useImportUsersMutation } from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as XLSX from "xlsx";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = ({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: any;
  refetch: any;
}) => {
  const [importUsers] = useImportUsersMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (success || error || info) {
      setInterval(() => {
        setSuccess("");
        setError("");
        setInfo("");
      }, 10000);
    }
  }, [success, error, info]);

  const handleFileUpload = async (event: any) => {
    setIsLoading(true);
    const selectedRows = rows.filter((row: any) =>
      rowSelectionModel.includes(row.id)
    );

    if (selectedRows.length === 0) {
      setInfo("Please select at least one row.");
      setIsLoading(false);
      return;
    }

    const payload = {
      selectedData: selectedRows,
    };

    try {
      const res = await importUsers(payload).unwrap();
      console.log(res);
      if (res.errors.length > 0) {
        res.errors.forEach((err: any) => {
          setError(err?.message);
        });
      }

      if (res.processedUsers.length > 0) {
        setSuccess("Members added successfully!");
      }
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      refetch();
      setIsLoading(false);
    }
  };

  const handlePreview = async (event: any) => {
    setError("");
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("File data could not be read.");

        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData: any[] = XLSX.utils.sheet_to_json(sheet);

        const mappedRows: any = excelData.map((row, index) => ({
          id: index + 1,
          firstName: row["First name"] || "",
          middleName: row["Middle Name"] || "",
          lastName: row["Second name"] || "",
          email: row["Email Address"] || "",
          phoneNumber: row["Your personal Phone number"] || "",
          whatsappNumber: row["Your WhatsApp number"] || "",
          residentCountry: row["Country of Residence"] || "",
          state: row["State (If not in Rwanda)"] || "",
          residentDistrict: row["District of Residence (If in Rwanda)"] || "",
          residentSector: row["Sector of Residence (If in Rwanda)"] || "",
          nearestLandmark:
            row[
              "Nearest Landmark (School, Church, Mosque, Hotel, or any other common known mark)"
            ] || "",
          cohort: row["Cohort"] || "",
          track: row["Track"] || "",
          initiativeName:
            row[
              "The name of your Initiative (organization you Founded or co-founded)  if Available"
            ] || "",
          initiativeSector:
            row[
              "Main Sector of intervention (Eg: Finance, Education, Agribusiness, Etc)"
            ] || "",
          initiativePosition:
            row[
              "Position with that Organizaton  (Eg: Founder & CEO, Co-Founder &CEO) or other Position"
            ] || "",
          initiativeAddress:
            row["Country of the initiative (District/Sector)"] || "",
          initiativeWebsite:
            row["Website or any online presence of your initiative"] || "",
          employerName:
            row["Organization Name (If employed by another organization)"] ||
            "",
          employerPosition:
            row["Position in the organization employing you"] || "",
          employerWebsite:
            row["Website of an Organization that Employs you (If available)"] ||
            "",
          employerAddress: row["Organization Address (Country)"] || "",
          gender: row["Gender"] || "",
          linkedin:
            row["LinkedIn Profile Link (https://linkedin.com/in/...)"] || "",
          instagram:
            row["Instagram Profile Link (https://instagram.com/...)"] || "",
          facebook:
            row["Facebook Profile Link (https://facebook.com/...)"] || "",
          twitter: row["X (Twitter) Profile Link (https://x.com/...)"] || "",
        }));

        setRows(mappedRows);
      } catch (err) {
        console.error("Error parsing file:", err);
        setError("Failed to parse the file. Please check the format.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Second Name",
      width: 150,
      editable: true,
    },
    { field: "email", headerName: "Email Address", width: 200, editable: true },
    {
      field: "phoneNumber",
      headerName: "Your Personal Phone Number",
      width: 180,
      editable: true,
    },
    {
      field: "whatsappNumber",
      headerName: "Your WhatsApp Number",
      width: 180,
      editable: true,
    },
    {
      field: "residentCountry",
      headerName: "Country of Residence",
      width: 200,
      editable: true,
    },
    {
      field: "state",
      headerName: "State (If not in Rwanda)",
      width: 200,
      editable: true,
    },
    {
      field: "residentDistrict",
      headerName: "District of Residence (If in Rwanda)",
      width: 230,
      editable: true,
    },
    {
      field: "residentSector",
      headerName: "Sector of Residence (If in Rwanda)",
      width: 230,
      editable: true,
    },
    {
      field: "nearestLandmark",
      headerName:
        "Nearest Landmark (School, Church, Mosque, Hotel, or any other common known mark)",
      width: 300,
      editable: true,
    },
    { field: "cohort", headerName: "Cohort", width: 100, editable: true },
    { field: "track", headerName: "Track", width: 150, editable: true },
    {
      field: "initiativeName",
      headerName: "Name of Your Initiative",
      width: 250,
      editable: true,
    },
    {
      field: "initiativeSector",
      headerName: "Main Sector of Intervention",
      width: 200,
      editable: true,
    },
    {
      field: "initiativePosition",
      headerName: "Position with Initiative",
      width: 250,
      editable: true,
    },
    {
      field: "initiativeAddress",
      headerName: "Country of the Initiative (District/Sector)",
      width: 250,
      editable: true,
    },
    {
      field: "initiativeWebsite",
      headerName: "Website/Online Presence of Initiative",
      width: 250,
      editable: true,
    },
    {
      field: "employerName",
      headerName: "Organization Name (If employed by another organization)",
      width: 300,
      editable: true,
    },
    {
      field: "employerPosition",
      headerName: "Position in Employing Organization",
      width: 250,
      editable: true,
    },
    {
      field: "employerWebsite",
      headerName: "Website of Employing Organization (If available)",
      width: 250,
      editable: true,
    },
    {
      field: "employerAddress",
      headerName: "Organization Address (Country)",
      width: 200,
      editable: true,
    },
    { field: "gender", headerName: "Gender", width: 130, editable: true },
    {
      field: "linkedin",
      headerName: "LinkedIn Profile Link",
      width: 300,
      editable: true,
    },
    {
      field: "instagram",
      headerName: "Instagram Profile Link",
      width: 300,
      editable: true,
    },
    {
      field: "facebook",
      headerName: "Facebook Profile Link",
      width: 300,
      editable: true,
    },
    {
      field: "twitter",
      headerName: "X (Twitter) Profile Link",
      width: 300,
      editable: true,
    },
  ];

  return (
    <Dialog
      TransitionComponent={Transition}
      fullScreen
      open={isOpen}
      onClose={toggleModal}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Import Members
          </Typography>
          <Button autoFocus color="inherit" onClick={handleFileUpload}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Excel File
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                handlePreview(e);
              }}
              multiple
            />
          </Button>
          <Typography>
            Download the template{" "}
            <Link className="underline" href="/template_alumni.xlsx">
              Here
            </Link>
          </Typography>
        </Box>
        {error && (
          <Alert
            sx={{ margin: "15px 0px 15px 0px" }}
            variant="filled"
            severity="error"
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            sx={{ margin: "15px 0px 15px 0px" }}
            variant="filled"
            severity="success"
          >
            {success}
          </Alert>
        )}
        {info && (
          <Alert
            variant="filled"
            sx={{ margin: "15px 0px 15px 0px" }}
            severity="warning"
          >
            {info}
          </Alert>
        )}
        {isLoading && <Loading />}
        {!isLoading && (
          <DataGrid
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newSelection: any) =>
              setRowSelectionModel(newSelection)
            }
            rows={rows}
            columns={columns}
            editMode="row"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
            }}
            sx={(theme) => ({
              marginTop: "15px",
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
