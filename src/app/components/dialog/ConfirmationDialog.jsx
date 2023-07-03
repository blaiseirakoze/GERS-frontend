import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export default function ConfirmationDialog({title, message, action, handleClose, open}) {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button 
          onClick={handleClose} 
          color="primary">
            Cancel
          </Button>

          <Button onClick={action} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
