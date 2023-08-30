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
import moment from "moment";
import ConfirmationDialog from "app/components/dialog/ConfirmationDialog";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import { Fab } from "@mui/material";
import ChangeStatus from "./ChangeStatus";
import jwtDecode from "jwt-decode";
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

const Details = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgSuccess = palette.success.main;
  const bgWarning = palette.warning.main;
  const bgInfo = palette.info.main;
  const bgSecondary = palette.secondary.main;

  const editor = useRef(null);
  const location = useLocation();
  const request = location?.state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");
  const [content, setContent] = useState(request?.reason);

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [changeStatusInfo, setChangeStatusInfo] = useState({
    status: "",
    comment: "",
    id: request?.id,
  });
  const [alert, setAlert] = useState({
    error: false,
    message: "",
  });

  const handleOpenChangeStatus = (title, status) => {
    setChangeStatusInfo({ ...changeStatusInfo, title, status });
    setOpen(true);
  };
  const handleCloseChangeStatus = () => setOpen(false);

  // get requests
  const getRequests = async () => {
    try {
      const url = `/request/view`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setRequests(data?.data);
    } catch (error) {}
  };
  // handle submit
  const handleSubmit = async () => {
    try {
      const url = `/request/change-status/${changeStatusInfo.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      await axios({ method, headers, url, data: changeStatusInfo });
      navigate("/requests");
      setOpen(false);
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };

  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenDelete = (id) => {
    setId(id);
    setOpenDelete(true);
  };

  useEffect(() => {
    getRequests();
  }, []);

  // open document
  const [openDocument, setOpenDocument] = useState(false);
  const [fileName, setFileName] = useState("");
  const handleOpenDocument = (fileName) => {
    setFileName(fileName);
    setOpenDocument(true);
  };
  const handleCloseDocument = () => setOpenDocument(false);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = accessToken && jwtDecode(accessToken);
  const role = decodedToken?.userRole;

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
            { name: "Request", path: "/requests" },
            { name: "Requests" },
          ]}
        />
      </Box>
      <Stack spacing={3}>
        <SimpleCard title="">
          <div className="d-flex justify-content-between ">
            <div overflow="auto">
              <span className="text-capitalize">{request?.title}: </span>{" "}
              <Small
                bgcolor={
                  request?.status === "pending"
                    ? bgWarning
                    : request?.status === "missing information"
                    ? bgInfo
                    : request?.status === "approved"
                    ? bgSuccess
                    : bgError
                }
              >
                {request.status}
              </Small>
            </div>
            {request?.status === "pending" && role === "risa" ? (
              <div>
                <StyledButton
                  onClick={() =>
                    handleOpenChangeStatus(
                      "missing information",
                      "missing information"
                    )
                  }
                  variant="outlined"
                  color="info"
                >
                  Missing info
                </StyledButton>
                <StyledButton
                  onClick={() => handleOpenChangeStatus("approve", "approved")}
                  variant="outlined"
                  color="success"
                >
                  Approve
                </StyledButton>
                <StyledButton
                  onClick={() => handleOpenChangeStatus("reject", "rejected")}
                  variant="outlined"
                  color="warning"
                >
                  Reject
                </StyledButton>
              </div>
            ) : null}
          </div>
        </SimpleCard>

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
            value={content}
            onBlur={(newContent) => setContent(newContent)}
            onChange={(newContent) => {}}
          />
        </SimpleCard>

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

        <SimpleCard title="Request Process">
          {request?.requestProcess?.map((process, index) => {
            return (
              <div key={index} className="mb-4">
                <div className="p-0">
                  {" "}
                  <IconButton
                    color={
                      process.status === "pending"
                        ? "warning"
                        : process.status === "approved"
                        ? "success"
                        : process.status === "rejected"
                        ? "danger"
                        : "info"
                    }
                  >
                    <Icon>fiber_manual_record</Icon>
                  </IconButton>{" "}
                  <span> {process?.status}</span> -{" "}
                  {process?.createdBy?.firstName} {process?.createdBy?.lastName}{" "}
                  - {moment(process?.createdAt).format("DD-MM-yyyy HH:mm")}
                </div>
                {process?.comment ? (
                  <div style={{ marginLeft: "2.8rem" }}>
                    comment: {process.comment}
                  </div>
                ) : null}
              </div>
            );
          })}
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default Details;
