"use client";

import React, { useRef, useState } from "react";
import { Box, Modal, IconButton, Button, Slider, styled } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import Cropper from "react-easy-crop";
import { User } from "@/types/user";
import {
  useUpdateProfilePictureMutation,
  useUploadPictureMutation,
} from "@/lib/features/userSlice";

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

const ImageUploader = ({
  user,
  refetch,
  setError,
  setSuccess,
  setLoading,
}: {
  user: User;
  refetch: any;
  setError: any;
  setSuccess: any;
  setLoading: any;
}) => {
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(
    user?.profileImage?.link || "/placeholder.svg"
  );
  const [imageData, setImageData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPicture] = useUploadPictureMutation();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageData(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setUploadedImage(null);
    setImageData("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    setPreview(uploadedImage);
    setLoading(true);
    if (imageData) {
      try {
        const formData = new FormData();
        formData.append("profileImage", imageData);
        formData.append("userId", user?.id);

        const data = await uploadPicture(formData).unwrap();

        if (data?.image) {
          setSuccess("Image uploaded successfully!");
          setUploadSuccess(true);
          setOpen(false);
          setUploadedImage(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          try {
            const res = await updateProfilePicture({
              userId: user?.id,
              pictureId: data?.image?.id,
            }).unwrap();
            if (res.status === 200) {
              setSuccess("Image successfully updated!");
            } else {
              setError("Failed to update the profile picture, try again!");
            }
          } catch (error: any) {
            setError(error?.message);
          }
          refetch();
        }
      } catch (error: any) {
        setError(error?.error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box position="relative" display="inline-block">
      <img
        src={user?.profileImage?.link || "/placeholder.svg"}
        alt="Profile"
        className="w-48 h-48 object-cover rounded-full"
      />

      <IconButton
        color="primary"
        component="label"
        className="bg-gray-100 border border-white"
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
        }}
      >
        <PhotoCamera />
        <VisuallyHiddenInput
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
        />
      </IconButton>

      <Modal open={open} onClose={handleCancel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            minHeight: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
          }}
        >
          {uploadedImage ? (
            <>
              <Cropper
                image={uploadedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
              <Box mt={2}>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(_, value) => {
                    if (typeof value === "number") {
                      setZoom(value);
                    }
                  }}
                  aria-labelledby="zoom-slider"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap={2}
                mt={2}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmUpload}
                >
                  Confirm
                </Button>
              </Box>
            </>
          ) : (
            <Box>No image selected</Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageUploader;
