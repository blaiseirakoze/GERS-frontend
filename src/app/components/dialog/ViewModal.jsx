import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  // height: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, handleClose, fileName }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // style={{ width: "100%" }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Doc
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <iframe
              title="preview"
              width="100%"
              color="red"
              height="700"
              src={fileName && require(`../../../files/${fileName}`)}
            />
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
