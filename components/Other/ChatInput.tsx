"use client";

import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";

function ChatInput({
  value,
  setValue,
  onSubmit,
}: {
  value: string;
  setValue: any;
  onSubmit: any;
}) {
  return (
    <div className="relative w-full min-w-[200px]">
      <TextField
        value={value}
        onChange={setValue}
        label="Type your message here"
        className="w-full"
        placeholder="Enter your message"
        variant="filled"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}

export default ChatInput;
