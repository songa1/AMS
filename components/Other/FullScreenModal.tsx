import React, { useState, useEffect, useRef } from "react";
import { useImportUsersMutation } from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import {
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

const acceptedCSVTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

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
  const toast: any = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFileUpload = async (event: any) => {
    setIsLoading(true);
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await importUsers(formData).unwrap();
      console.log(res);
      if (res.errors.length > 0) {
        res.errors.forEach((err: any) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `Row: ${err?.row["Email Address"]}. ${err?.message}`,
          });
        });
      }

      if (res.processedUsers.length > 0) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `${res.processedUsers.length} rows has been processed!`,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
      setIsOpen(!isOpen);
      setIsLoading(false);
    }
  };

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
              onChange={handleFileUpload}
              multiple
            />
          </Button>
        </Box>
        {isLoading && <Loading />}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
