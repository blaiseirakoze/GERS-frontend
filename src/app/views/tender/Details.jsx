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
  Snackbar
} from "@mui/material";
import { Span } from "app/components/Typography";
import { TextValidator, ValidatorForm, SelectValidator } from "react-material-ui-form-validator";
import moment from "moment";
import ConfirmationDialog from "app/components/dialog/ConfirmationDialog";
import JoditEditor from 'jodit-react';
import { useRef } from 'react';
import { Fab } from '@mui/material';
import ChangeStatus from "./ChangeStatus";

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

const Small = styled('small')(({ bgcolor }) => ({
  width: 70,
  height: 25,
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '8px',
  overflow: 'hidden',
  background: bgcolor,
  boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
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
    id: tender?.id
  });
  const [alert, setAlert] = useState({
    error: false,
    message: ""
  });
  const [state, setState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: { value: "", label: "" },
    gender: ""
  });
  const {
    username,
    firstName,
    lastName,
    email,
    phone,
    roleId,
    gender
  } = state;

  const handleOpenChangeStatus = (title, status) => {
    setChangeStatusInfo({ ...changeStatusInfo, title, status })
    setOpen(true)
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
    } catch (error) {
    }
  }
  // handle submit
  const handleSubmit = async () => {
    try {
      const url = `/tender/change-status/${changeStatusInfo.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      await axios({ method, headers, url, data: changeStatusInfo });
      navigate("/tenders");
      setOpen(false);
    } catch (error) {
      setAlert({ ...alert, error: true, message: error?.response?.data?.message?.toString() })
    }
  }

  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenDelete = (id) => {
    setId(id);
    setOpenDelete(true)
  };

  const handleChange = (event) => {
    // event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <Container>
      <ChangeStatus
        open={open}
        handleClose={handleCloseChangeStatus}
        info={changeStatusInfo}
        setInfo={setChangeStatusInfo}
        handleSubmit={handleSubmit}
        alert={alert} />
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb routeSegments={[{ name: "Tenders", path: "/tenders" }, { name: "tenders" }]} />
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
              <div className="fw-bold text-capitalize "> {moment(tender?.openDate).format("DD-MM-yyyy")} </div>
              <div className="fw-bold text-capitalize "> {moment(tender?.closeDate).format("DD-MM-yyyy")}  </div>
              <div className="fw-bold text-capitalize "> {tender?.description}  </div>
            </Stack>
          </div>
        </SimpleCard>

        <SimpleCard title="Bid Information">
          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Grid container spacing={6}>
              {
                tender?.tenderDocuments?.map(doc => {
                  return <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <label htmlFor="">{doc.name}</label>
                    <TextField
                      type="file"
                      name={doc.name}
                      label={""}
                      onChange={handleChange}
                      value={firstName || ""}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </Grid>
                })
              }
            </Grid>
            <div className='text-end'>
              <Button
                onClick={() => navigate("/tenders")}
                color="primary"
                variant="outlined"
                type="button">
                <Icon>cancel</Icon>
                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cancel</Span>
              </Button>
              <Button color="primary" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{ pl: 1, textTransform: "capitalize" }}>{"Submit"}</Span>
              </Button>
            </div>

          </ValidatorForm>
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default Details;
