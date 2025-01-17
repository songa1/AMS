"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";

function ConfirmModal({
  open,
  closeModal,
  action,
  title,
  description,
  confirmText,
  cancelText,
}: {
  open: boolean;
  closeModal: any;
  action: any;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}) {
  return (
    <Dialog open={open} keepMounted onClose={closeModal}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="mt-2">
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={action}
        >
          {confirmText}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={closeModal}
        >
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
