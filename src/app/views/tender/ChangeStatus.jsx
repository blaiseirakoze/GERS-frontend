import { useState } from 'react';
import { Alert, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ChangeStatus = ({ open, handleClose, info, setInfo, handleSubmit, alert }) => {
    const { title } = info;
    return (
        <Box>
            <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle className='text-capitalize' id="form-dialog-title">{title}</DialogTitle>
                {alert?.error ?
                    <Alert onClose={handleClose} sx={{ m: 1 }} severity="error" variant="filled">
                        {alert?.message}
                    </Alert> : null
                }
                <DialogContent>
                    <DialogContentText>
                        Write your comment and submit
                    </DialogContentText>

                    <TextField
                        fullWidth
                        autoFocus
                        id="name"
                        type="textArea"
                        margin="normal"
                        label="Comment"
                        onChange={(event) => setInfo({ ...info, comment: event.target.value })}
                    />
                </DialogContent>

                <DialogActions>
                    <Button color="primary" variant="outlined" type="button" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" type="submit">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default ChangeStatus;