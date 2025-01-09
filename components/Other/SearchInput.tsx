"use client";

import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchInput({
  value,
  setValue,
  onSubmit,
}: {
  value: string;
  setValue: any;
  onSubmit: any;
}) {
  return (
    <div className="relative flex h-10 w-full max-w-[300px]">
      <TextField
        label="Search Members"
        sx={{ width: "30ch" }}
        value={value}
        onChange={setValue}
        placeholder="Type the name or email of member"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}

export default SearchInput;
