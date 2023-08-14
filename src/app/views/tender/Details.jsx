import { Breadcrumb, SimpleCard } from "app/components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../store/helpers/axios";
import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
  Stack,
  Typography,
} from "@mui/material";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Remove,
  Alert,
  Snackbar,
} from "@mui/material";
import { Span } from "app/components/Typography";
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";
import moment from "moment";
import ConfirmationDialog from "app/components/dialog/ConfirmationDialog";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import { Fab } from "@mui/material";
import ChangeStatus from "./ChangeStatus";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import jwtDecode from "jwt-decode";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 70,
  height: 25,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "8px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Details = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgSuccess = palette.success.main;
  const bgWarning = palette.warning.main;
  const bgInfo = palette.info.main;
  const bgSecondary = palette.secondary.main;

  const editor = useRef(null);
  const location = useLocation();
  const tender = location?.state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");
  const [content, setContent] = useState(tender?.reason);

  const navigate = useNavigate();
  const [tenders, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [changeStatusInfo, setChangeStatusInfo] = useState({
    status: "",
    comment: "",
    id: tender?.id,
  });
  const [alert, setAlert] = useState({
    error: false,
    message: "",
  });
  const [state, setState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: { value: "", label: "" },
    gender: "",
  });
  const { username, firstName, lastName, email, phone, roleId, gender } = state;

  const handleOpenChangeStatus = (title, status) => {
    setChangeStatusInfo({ ...changeStatusInfo, title, status });
    setOpen(true);
  };
  const handleCloseChangeStatus = () => setOpen(false);

  // get tenders
  const getRequests = async () => {
    try {
      const url = `/tender/view`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setRequests(data?.data);
    } catch (error) {}
  };

  // handle upload files
  const [doc, setDoc] = useState([]);
  const handleChange = (event) => {
    event.persist();
    setDoc([...doc, event.target.files[0]]);
  };

  // handle submit
  const handleSubmit = async () => {
    try {
      if (doc?.length != tender?.tenderDocuments?.length) {
        setAlert({
          ...alert,
          error: true,
          message: "please! upload all required documents",
        });
      } else {
        setAlert({
          ...alert,
          error: false,
        });
        const url = `/bid/create`;
        const headers = {
          "Content-Type": "application/json",
        };
        const method = "post";
        const info = new FormData();
        console.log("doc ------------------ ", typeof(doc));
        info.append("tenderId", tender?.id);
        for (let i = 0; i < doc.length; i++) {
          info.append("bidDocuments", doc[i]);
        }

        console.log("info ------------ ",   );

        await axios({ method, headers, url, data: info });
        // navigate("/tenders");
        setOpen(false);
        setOpenBidForm(false);
      }
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message.toString(),
      });
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [openBidForm, setOpenBidForm] = useState(false);
  const handleClickOpen = () => setOpenBidForm(true);
  const handleClose = () => setOpenBidForm(false);

  useEffect(() => {
    getRequests();
  }, []);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = accessToken && jwtDecode(accessToken);
  const role = decodedToken?.userRole;

  return (
    <Container>
      <ChangeStatus
        open={open}
        handleClose={handleCloseChangeStatus}
        info={changeStatusInfo}
        setInfo={setChangeStatusInfo}
        handleSubmit={handleSubmit}
        alert={alert}
      />
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb
          routeSegments={[
            { name: "Tenders", path: "/tenders" },
            { name: "tenders" },
          ]}
        />
      </Box>
      <Stack spacing={3}>
        <SimpleCard title={tender?.name}>
          {/* <div className="d-flex justify-content-between fw-bold text-capitalize mb-4">
            {tender?.name}
          </div> */}
          <div className="d-flex justify-content-between w-50">
            <Stack spacing={2} width="100%" overflow="auto">
              <div className="text-capitalize ">open date:</div>
              <div className="text-capitalize ">close date: </div>
              <div className="text-capitalize ">Description: </div>
            </Stack>
            <Stack spacing={2} width="100%" overflow="auto">
              <div className="fw-bold text-capitalize ">
                {" "}
                {moment(tender?.openDate).format("DD-MM-yyyy")}{" "}
              </div>
              <div className="fw-bold text-capitalize ">
                {" "}
                {moment(tender?.closeDate).format("DD-MM-yyyy")}{" "}
              </div>
              <div className="fw-bold text-capitalize ">
                {" "}
                {tender?.description}{" "}
              </div>
            </Stack>
          </div>
        </SimpleCard>

        <SimpleCard title="Bid Information">
          <Dialog
            open={openBidForm}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Bid form</DialogTitle>
            {alert?.error ? (
              <Alert
                onClose={handleClose}
                sx={{ m: 1 }}
                severity="error"
                variant="filled"
              >
                {alert?.message}
              </Alert>
            ) : null}
            <DialogContent>
              <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Grid container spacing={6}>
                  {tender?.tenderDocuments?.map((dc, index) => {
                    return (
                      <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <label htmlFor="">{dc.name}</label>
                        <TextField
                          type="file"
                          name={dc.name}
                          label={""}
                          onChange={handleChange}
                          // value={["cv"]}
                          // validators={["required"]}
                          // errorMessages={["this field is required"]}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
                <div className="text-end">
                  <Button
                    onClick={handleClose}
                    color="primary"
                    variant="outlined"
                    type="button"
                  >
                    <Icon>cancel</Icon>
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                      Cancel
                    </Span>
                  </Button>
                  <Button color="primary" variant="contained" type="submit">
                    <Icon>send</Icon>
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                      {"Apply"}
                    </Span>
                  </Button>
                </div>
              </ValidatorForm>
            </DialogContent>
          </Dialog>
          <Box className="breadcrumb d-flex justify-content-between align-items-center">
            <Typography>Bidders list</Typography>
            {role === "supplier" ? (
              <StyledButton
                onClick={handleClickOpen}
                variant="contained"
                color="primary"
              >
                Send your application
              </StyledButton>
            ) : null}
          </Box>
          <Box width="100%" overflow="auto">
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Bidder name</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Documents</TableCell>
                  <TableCell align="center">Submited at</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenders
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tender, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{""}</TableCell>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </StyledTable>

            <TablePagination
              sx={{ px: 2 }}
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={""}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{ "aria-label": "Next Page" }}
              backIconButtonProps={{ "aria-label": "Previous Page" }}
            />
          </Box>
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default Details;
