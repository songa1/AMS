"use client";

import {
  useAssignOrgMutation,
  useOrganizationsQuery,
} from "@/lib/features/orgSlice";
import { organization } from "@/types/user";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function ChangeOrganization({
  user,
  rel,
  refetch,
}: {
  user: any;
  rel: string;
  refetch: any;
}) {
  const [organizations, setOrganizations] = useState([]);
  const [newOrg, setNewOrg] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: OrganizationsData } = useOrganizationsQuery("");
  const [assignOrg] = useAssignOrgMutation();

  useEffect(() => {
    if (OrganizationsData) {
      setOrganizations(OrganizationsData?.data);
    }
  }, [OrganizationsData]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (newOrg === "new" || newOrg === "") {
        setInfo("Add a new organization above.");
        return;
      }
      const assign = await assignOrg({
        userId: user?.id,
        organizationId: newOrg,
        relationshipType: rel,
        position: position,
      }).unwrap();
      if (assign?.data) {
        setSuccess(assign?.message);
        refetch();
      }
    } catch (error: any) {
      console.log(error);
      setError(error?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ marginTop: "15px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0px 10px 0px",
        }}
      >
        <Typography fontWeight={800} className="italic" variant="body2">
          Or, choose among existing organizations;
        </Typography>
        <Button onClick={handleSubmit} size="small" variant="outlined">
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
      <Box sx={{ margin: "10px 0px 10px 0px" }}>
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="filled" severity="success">
            {success}
          </Alert>
        )}
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {info && (
          <Alert variant="filled" severity="warning">
            {info}
          </Alert>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
        }}
      >
        <FormControl
          variant="filled"
          sx={{ minWidth: 120, width: "100%", marginBottom: "15px" }}
        >
          <InputLabel>Choose your organization:</InputLabel>
          <Select
            value={newOrg}
            variant="filled"
            onChange={(e) => setNewOrg(e.target.value)}
          >
            <MenuItem key={100} value="new">
              Add a new company
            </MenuItem>
            {organizations.map((item: organization) => (
              <MenuItem key={item?.id} value={item.id}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Position"
          value={position}
          variant="filled"
          onChange={(e) => setPosition(e.target.value)}
        />
      </Box>
    </Box>
  );
}

export default ChangeOrganization;
