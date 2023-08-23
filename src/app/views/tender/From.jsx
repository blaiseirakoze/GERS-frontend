import { Stack } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup,
  styled,
  Remove,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../store/helpers/axios";
import { amber, green } from "@mui/material/colors";
import { default as ReactSelect } from "react-select";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
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

const BasicForm = () => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    error: false,
    message: "",
  });
  const [content, setContent] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState();
  const editor = useRef(null);
  const location = useLocation();
  const [request, setRequest] = useState(location?.state || "");
  const [documents, setDocuments] = useState([]);
  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, error: false, message: "" });
  }

  const [state, setState] = useState([
    {
      name: "",
      type: "",
      description: "",
    },
  ]);
  const [stateTender, setStateTender] = useState([
    {
      name: "",
      description: "",
      publishDate: new Date(),
      openDate: "",
      closeDate: "",
    },
  ]);
  // const [requestState, setRequest] = useState();
  const [doc, setDoc] = useState();
  const { name, description, type } = state;
  const navigate = useNavigate();

  // update user
  const handleSubmit = async () => {
    try {
      const url = `/tender/create`;
      const headers = {
        "Content-Type": "application/json",
      };
      const info = {
        ...stateTender,
        requestId: request?.id,
        documents,
      };
      const method = "post";
      const { data } = await axios({ method, headers, url, data: info });
      if (data) {
        navigate("/tenders");
      }
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message,
      });
    }
  };

  // create user
  const handleUpdate = async (event) => {
    try {
      const url = `/request/update/${request?.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      const { data } = await axios({ method, headers, url, data: state });
      if (data) {
        navigate("/requests");
      }
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };

  // get requests
  const [requests, setRequests] = useState([]);
  const getRequests = async () => {
    try {
      const url = `/request/search?status=approved&tenderPublished=0`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setRequests(data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (location?.pathname === `/requests/update/${request?.id}`) {
      setContent(request?.reason);
      setState({ ...state, title: request?.title });
      setIsUpdate(true);
    }
    getRequests();
    setSelectedRequest({
      label: location?.state?.title,
      value: location?.state?.id,
    });
  }, []);

  const handleChange = (event) => {
    event.persist();
    if (event.target.type === "file") {
      setDoc(event.target.files[0]);
    }
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const handleChangeTender = (event) => {
    setStateTender({ ...stateTender, [event.target.name]: event.target.value });
  };
  const types = ["pdf", "docs"];
  // console.log("state ------------------- ", stateTender);
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Create", path: "/tenders" },
            { name: "form" },
          ]}
        />
      </Box>
      <Stack spacing={3}>
        <SimpleCard
          title={isUpdate ? "Update Tender" : `Create Tender`}
          padding={"20px 24px 80px 24px"}
        >
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
        </SimpleCard>
        {/* <SimpleCard title="Requester"> */}
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <label htmlFor="">Select Request </label>
          <ReactSelect
            className="z-3 bg-white"
            value={selectedRequest}
            name="request"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                padding: 7,
                marginBottom: 18,
              }),
            }}
            required
            options={requests?.map((request) => ({
              value: request?.id,
              label: request?.title,
            }))}
            onChange={async (v) => {
              setSelectedRequest(v);
              const req = await requests?.find((r) => r.id === v.value);
              setRequest(req);
            }}
          />
        </Grid>
        {/* </SimpleCard> */}
        {request !== "" || request !== undefined ? (
          <>
            <SimpleCard title="Requester">
              <div className="d-flex justify-content-between w-50">
                <Stack spacing={2} width="100%" overflow="auto">
                  <div className="fw-bold text-capitalize ">names:</div>
                  <div className="fw-bold text-capitalize ">email: </div>
                  <div className="fw-bold text-capitalize ">phone: </div>
                  <div className="fw-bold text-capitalize ">role: </div>
                </Stack>
                <Stack spacing={2} width="100%" overflow="auto">
                  <div className=" text-capitalize ">
                    {" "}
                    {request?.requestedBy?.firstName}{" "}
                    {request?.requestedBy?.lastName}{" "}
                  </div>
                  <div className=" text-capitalize ">
                    {" "}
                    {request?.requestedBy?.role?.label}{" "}
                  </div>
                  <div className=" text-capitalize ">
                    {" "}
                    {request?.requestedBy?.email}{" "}
                  </div>
                  <div className=" text-capitalize ">
                    {" "}
                    {request?.requestedBy?.phone}{" "}
                  </div>
                </Stack>
              </div>
            </SimpleCard>
            <SimpleCard title="Request Letter">
              <JoditEditor
                required
                className="mb-4"
                ref={editor}
                value={request?.reason}
                onBlur={(newContent) => setContent(newContent)}
                onChange={(newContent) => {}}
              />
            </SimpleCard>
          </>
        ) : null}
        <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
          <Stack spacing={3}>
            <SimpleCard
              title={"Tender Information"}
              padding={"20px 24px 80px 24px"}
            >
              {/* <div> */}
              {/* <ValidatorForm onSubmit={isUpdate ? handleUpdate : handleSubmit} onError={() => null}> */}
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <label htmlFor="">
                    Name <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="text"
                    name="name"
                    label="Name"
                    onChange={handleChangeTender}
                    value={stateTender.name || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <label htmlFor="">
                    Description <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="textArea"
                    name="description"
                    label="Description"
                    onChange={handleChangeTender}
                    value={stateTender.description || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <label htmlFor="">
                    Open Date <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="date"
                    name="openDate"
                    label=""
                    onChange={handleChangeTender}
                    value={stateTender.openDate || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <label htmlFor="">
                    Close Date <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="date"
                    name="closeDate"
                    label=""
                    onChange={handleChangeTender}
                    value={stateTender.closeDate || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
              </Grid>
            </SimpleCard>

            <SimpleCard
              title={"Tender Required Documents"}
              padding={"20px 24px 80px 24px"}
            >
              <Grid container spacing={2}>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <label htmlFor="">
                    Name <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="text"
                    name="name"
                    label="Name"
                    onChange={handleChange}
                    value={name || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <label htmlFor="">
                    Description <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="textarea"
                    name="description"
                    label="Description"
                    onChange={handleChange}
                    value={description || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <label htmlFor="">
                    Type <span className="text-danger">*</span>
                  </label>
                  <TextField
                    type="text"
                    name="type"
                    label="Type"
                    onChange={handleChange}
                    value={type || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid
                  className="d-flex align-items-center justify-content-end"
                  item
                  lg={3}
                  md={3}
                  sm={12}
                  xs={12}
                >
                  <Button
                    onClick={() => {
                      if (name !== "" || description !== "" || type !== "") {
                        setDocuments([
                          ...documents,
                          { name, description, type },
                        ]);
                        setState({
                          ...state,
                          name: "",
                          description: "",
                          type: "",
                        });
                      }
                    }}
                    color="warning"
                    variant="contained"
                    type="button"
                  >
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>add</Span>
                  </Button>
                </Grid>
              </Grid>

              <StyledTable className="mb-4">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents?.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{doc?.name}</TableCell>
                      <TableCell align="center">{doc?.description}</TableCell>
                      <TableCell align="center">{doc?.type}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => {}}>
                          <Icon title="more details" color="danger">
                            delete
                          </Icon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>

              <div className="text-end">
                <Button
                  onClick={() => navigate("/requests")}
                  color="primary"
                  variant="outlined"
                  type="button"
                >
                  {/* <Icon>cancel</Icon> */}
                  <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                    Cancel
                  </Span>
                </Button>
                <Button color="primary" variant="contained" type="submit">
                  {/* <Icon>send</Icon> */}
                  <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                    {isUpdate ? "Update" : "Submit"}
                  </Span>
                </Button>
              </div>
            </SimpleCard>
          </Stack>
        </ValidatorForm>
      </Stack>
    </Container>
  );
};

export default BasicForm;
