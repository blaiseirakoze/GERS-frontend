import { Breadcrumb, SimpleCard } from "app/components";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { saveAs } from "file-saver";
import BasicModal from "app/components/dialog/ViewModal";

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
  const editor = useRef(null);
  const location = useLocation();
  const tender = location?.state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");
  const [content, setContent] = useState(tender?.reason);

  const navigate = useNavigate();
  const [tenderr, setTenderr] = useState();
  const [bids, setBids] = useState([]);
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
  const getBids = async () => {
    try {
      const url = `/bid/view-by-tender/${tender?.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setBids(data?.data);
    } catch (error) {}
  };

  // get tender
  const getTender = async () => {
    try {
      const url = `/tender/view/${tender?.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setTenderr(data?.data);
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
          "Content-Type": "multipart/form-data",
          Accept: "application/json, multipart/form-data, */*",
        };
        const method = "post";
        const info = new FormData();
        info.append("tenderId", tender?.id);
        for (let i = 0; i < doc.length; i++) {
          info.append("bidDocuments", doc[i]);
        }
        await axios({ method, headers, url, data: info });
        // navigate("/tenders");
        setOpen(false);
        setOpenBidForm(false);
        getBids();
        // navigate("")
      }
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };

  // approve bid
  const HandleApproveBid = async (bidId, bidder) => {
    try {
      const url = `/bid/change-status?tenderId=${tender?.id}&id=${bidId}&bidder=${bidder}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      await axios({ method, headers, url });
      getBids();
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
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
    getTender();
    getBids();
  }, [tender]);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = accessToken && jwtDecode(accessToken);
  const role = decodedToken?.userRole;
  const userId = decodedToken?.userId;

  // open document
  const [openDocument, setOpenDocument] = useState(false);
  const [fileName, setFileName] = useState("");
  const handleOpenDocument = (fileName) => {
    setFileName(fileName);
    setOpenDocument(true);
  };
  const handleCloseDocument = () => setOpenDocument(false);

  const [showBid, setShowBid] = useState(true);
  const [showTenderDetails, setShowTenderDetails] = useState(true);
  const [showContract, setShowContract] = useState(true);

  const handleDoc = async (event) => {
    event.persist();
    try {
      const file = event.target.files[0];
      const name = event.target.name;
      const info = new FormData();
      info.append(name, file);
      const url = `/tender/upload-document/${tender.id}`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json, multipart/form-data, */*",
      };
      const method = "put";
      await axios({ method, headers, url, data: info });
      getTender();
      getBids();
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const url = `/tender/change-status?id=${tender.id}&status=delivered`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      await axios({ method, headers, url });
      getTender();
      getBids();
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };
  const request = tenderr?.request;
  return (
    <Container>
      <BasicModal
        open={openDocument}
        handleClose={handleCloseDocument}
        fileName={fileName && fileName}
      />
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
        <SimpleCard
          title={tenderr?.name}
          show={showTenderDetails}
          setShow={setShowTenderDetails}
        >
          {/* <div className="d-flex justify-content-between fw-bold text-capitalize mb-4">
            {tender?.name}
          </div> */}
          {showTenderDetails ? (
            <div className="d-flex justify-content-between w-50">
              <Stack spacing={2} width="100%" overflow="auto">
                <div className="text-capitalize ">open date:</div>
                <div className="text-capitalize ">close date: </div>
                <div className="text-capitalize ">Description: </div>
              </Stack>
              <Stack spacing={2} width="100%" overflow="auto">
                <div className="fw-bold text-capitalize ">
                  {" "}
                  {moment(tenderr?.openDate).format("DD-MM-yyyy")}{" "}
                </div>
                <div className="fw-bold text-capitalize ">
                  {" "}
                  {moment(tenderr?.closeDate).format("DD-MM-yyyy")}{" "}
                </div>
                <div className="fw-bold text-capitalize ">
                  {" "}
                  {tenderr?.description}{" "}
                </div>
              </Stack>
            </div>
          ) : null}
        </SimpleCard>

        {/* ================================================ start request details =========================================================== */}
        {request?.documents ? (
          <SimpleCard title="Purchase Order Document">
            <div
              onClick={() => handleOpenDocument(request?.documents)}
              className="w-50 p-3 cursor-pointer lowercase bg-secondary m-2 p-2 rounded text-white"
            >
              {request?.documents}
            </div>
          </SimpleCard>
        ) : null}
        {/* ================================================ end request details ========================================================= */}
        
        {/* =============================================== bid information============================================================================= */}
        <SimpleCard title="Bid Information" show={showBid} setShow={setShowBid}>
          {showBid ? (
            <div>
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
                      {tenderr?.tenderDocuments?.map((dc, index) => {
                        return (
                          <Grid
                            item
                            lg={6}
                            md={6}
                            sm={12}
                            xs={12}
                            sx={{ mt: 2 }}
                          >
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
                  bids.length === 0 ? (
                    <StyledButton
                      onClick={handleClickOpen}
                      variant="contained"
                      color="primary"
                    >
                      Send your application
                    </StyledButton>
                  ) : (
                    <div className="fst-italic fw-bold text-success border-1 rounded">
                      You have applied to this tender
                    </div>
                  )
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
                      {role === "risa" || role === "admin" ? (
                        <TableCell align="right">Action</TableCell>
                      ) : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bids
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((bid, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {bid.bidBy.firstName} {bid.bidBy.lastName}
                          </TableCell>
                          <TableCell align="center">
                            {bid.description}
                          </TableCell>
                          <TableCell className="" align="center">
                            {bid?.documents.split(",")?.map((doc) => {
                              return (
                                <div
                                  onClick={() => handleOpenDocument(doc)}
                                  className=" cursor-pointer lowercase bg-secondary m-2 p-2 rounded text-white"
                                >
                                  {doc}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell align="center">
                            {moment(bid.createdAt).format("DD-MM-yyyy")}
                          </TableCell>
                          <TableCell align="center">
                            <span
                              class={
                                bid.status === "approved"
                                  ? "badge bg-success"
                                  : bid.status === "rejected"
                                  ? "badge bg-danger"
                                  : "badge bg-warning"
                              }
                            >
                              {bid.status}
                            </span>
                          </TableCell>
                          {role === "risa" || role === "admin" ? (
                            <TableCell align="right">
                              {bid.status === "pending" ? (
                                <StyledButton
                                  onClick={() =>
                                    HandleApproveBid(bid?.id, bid.bidder)
                                  }
                                  variant="outlined"
                                  color="success"
                                >
                                  Approve
                                </StyledButton>
                              ) : null}
                            </TableCell>
                          ) : null}
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
            </div>
          ) : null}
        </SimpleCard>

        {/* =================================== start Deliverables && confirm Deliverables ====================================== */}
        {role === "supplier" && tenderr?.supplier?.id !== userId ? null : (
          <>
            <SimpleCard
              title="Deliverables"
              show={showContract}
              setShow={setShowContract}
            >
              {showContract ? (
                <div>
                  <Box className="breadcrumb d-flex justify-content-between align-items-center">
                    <Typography>
                      This section is for the supplier to upload the required
                      documents
                    </Typography>
                  </Box>

                  <div>
                    <ValidatorForm
                    // onSubmit={isUpdate ? handleUpdate : handleSubmit}
                    // onError={() => null}
                    >
                      <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={6} xs={6} sx={{ mt: 2 }}>
                          <div className="mb-4">
                            <label htmlFor="">Delivery Note Document:</label>
                            {tenderr?.deliveryNote ? (
                              <div
                                onClick={() =>
                                  handleOpenDocument(tenderr?.deliveryNote)
                                }
                                className=" cursor-pointer lowercase bg-secondary p-3 rounded text-white"
                              >
                                {tenderr?.deliveryNote}
                              </div>
                            ) : role === "supplier" ? (
                              <TextField
                                type="file"
                                name="deliveryNote"
                                onChange={handleDoc}
                              />
                            ) : null}
                          </div>
                          <div>
                            <label htmlFor="">Receipt document</label>
                            {tenderr?.receipt ? (
                              <div
                                onClick={() =>
                                  handleOpenDocument(tenderr?.receipt)
                                }
                                className=" cursor-pointer lowercase bg-secondary p-3 rounded text-white"
                              >
                                {tenderr?.receipt}
                              </div>
                            ) : role === "supplier" ? (
                              <TextField
                                type="file"
                                name="receipt"
                                onChange={handleDoc}
                              />
                            ) : null}
                          </div>
                        </Grid>
                      </Grid>
                    </ValidatorForm>
                  </div>
                </div>
              ) : null}
            </SimpleCard>

            {tender?.deliveryNote && role === "company" ? (
              <SimpleCard
                title="Confirm Deliverables"
                show={showContract}
                setShow={setShowContract}
              >
                {showContract ? (
                  <div>
                    <Box className="breadcrumb d-flex justify-content-between align-items-center">
                      <Typography>
                        This section is for the institution who requested for
                        the tools
                      </Typography>
                    </Box>

                    <div>
                      <div>
                        {tenderr?.delivered ? (
                          <div className="fst-italic fw-bold text-success border-1 rounded">
                            You have confirmed that the tools you requested have
                            successfully delivered
                          </div>
                        ) : (
                          <Button
                            onClick={handleConfirmDelivery}
                            className="p-3"
                            color="primary"
                            variant="contained"
                            type="submit"
                          >
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                              Confirm that you successfully received the tools
                            </Span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </SimpleCard>
            ) : null}
          </>
        )}
        {/* ====================================== end deliverables and confirm deliverables ===================================== */}
      </Stack>
    </Container>
  );
};

export default Details;
