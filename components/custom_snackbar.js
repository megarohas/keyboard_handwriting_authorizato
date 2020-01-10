import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

const CustomSnackbar = ({ is_open, on_close, message }) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    key={`${"top"},${"center"}`}
    open={is_open}
    onClose={() => {
      on_close();
    }}
    ContentProps={{
      "aria-describedby": "message-id"
    }}
    message={
      <span
        id="message-id"
        style={{
          fontFamily: "Roboto",
          fontSize: "20px",
          textAlign: "center"
        }}
      >
        {message}
      </span>
    }
  />
);

export default CustomSnackbar;
