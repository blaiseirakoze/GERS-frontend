import { Breadcrumb, SimpleCard } from "app/components";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import moment from "moment";
import ConfirmationDialog from "app/components/dialog/ConfirmationDialog";
import jwtDecode from "jwt-decode";
import ExportPdf from "app/components/report/exportPdf";

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
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

const Requests = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgSuccess = palette.success.main;
  const bgWarning = palette.warning.main;
  const bgInfo = palette.info.main;
  const bgSecondary = palette.secondary.main;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

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

  // handle delete
  const handleDelete = async () => {
    try {
      const url = `/request/delete/${id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "delete";
      await axios({ method, headers, url });
      getRequests();
      setOpenDelete(false);
    } catch (error) {}
  };

  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenDelete = (id) => {
    setId(id);
    setOpenDelete(true);
  };

  useEffect(() => {
    getRequests();
  }, []);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = accessToken && jwtDecode(accessToken);
  const role = decodedToken?.userRole;

  return (
    <Container>
      <ConfirmationDialog
        title={"Delete Request"}
        message={"Are you sure you want to delete this request?"}
        action={handleDelete}
        handleClose={handleCloseDelete}
        open={openDelete}
      />
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb
          routeSegments={[
            { name: "Request", path: "/requests" },
            { name: "Requests" },
          ]}
        />
        {role === "company" ? (
          <StyledButton
            onClick={() => navigate("create")}
            variant="contained"
            color="primary"
          >
            Add new
          </StyledButton>
        ) : null}
      </Box>
      {/* <ExportPdf reportData={requests} /> */}
      <SimpleCard title="Requests">
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="center">Requested by</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{request?.title}</TableCell>
                    <TableCell align="center">
                      {request?.requestedBy?.firstName}{" "}
                      {request?.requestedBy?.lastName}
                    </TableCell>
                    <TableCell align="center">
                      {moment(request?.createdAt).format("DD-MM-yyyy")}
                    </TableCell>
                    <TableCell align="center">
                      {" "}
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
                        {request?.status}
                      </Small>{" "}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          navigate(`details/${request?.id}`, {
                            state: request,
                          });
                        }}
                      >
                        <Icon title="more details" color="info">
                          info
                        </Icon>
                      </IconButton>
                      {request?.status === "pending" ||
                      request?.status === "missing information" ? (
                        <IconButton
                          onClick={() =>
                            navigate(`update/${request.id}`, { state: request })
                          }
                          title="update"
                        >
                          <Icon color="info">edit</Icon>
                        </IconButton>
                      ) : null}
                      {request?.status === "pending" ? (
                        <IconButton
                          onClick={() => {
                            handleOpenDelete(request?.id);
                          }}
                        >
                          <Icon title="delete" color="error">
                            close
                          </Icon>
                        </IconButton>
                      ) : null}
                      {request?.status === "approved" &&
                      request?.tenderPublished === false ? (
                        <IconButton
                          onClick={() => {
                            navigate("/tenders/create", { state: request });
                          }}
                        >
                          <Icon title="create tender" color="info">
                            work
                          </Icon>
                        </IconButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </StyledTable>

          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={requests.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </Box>
      </SimpleCard>
    </Container>
  );
};

export default Requests;
