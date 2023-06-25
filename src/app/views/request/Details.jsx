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
import JoditEditor from 'jodit-react';
import { useRef } from 'react';
import { Fab } from '@mui/material';

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
    } catch (error) {
    }
  }

  // handle delete
  const handleDelete = async () => {
    try {
      const url = `/user/delete/${id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "delete";
      await axios({ method, headers, url });
      getRequests();
      setOpenDelete(false);
    } catch (error) {
    }
  }

  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenDelete = (id) => {
    setId(id);
    setOpenDelete(true)
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <Container>
      <ConfirmationDialog
        title={"Delete User"}
        message={"Are you sure you want to delete this user?"}
        action={handleDelete}
        handleClose={handleCloseDelete}
        open={openDelete} />
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb routeSegments={[{ name: "Request", path: "/requests" }, { name: "Requests" }]} />
      </Box>
      <Stack spacing={3}>
        <SimpleCard title="">
          <div className="d-flex justify-content-between w-100">
            <div width="100%" overflow="auto">
              <Small bgcolor={request.status === "pending" ? bgWarning : bgError}>{request.status}</Small>
            </div>
            <div className="d-flex w-50 justify-content-between">
              <button className="bg-white text-warning border-1 border-warning rounded py-1 px-4 text-capitalize m-l">
                missing information
              </button>
              <button className="bg-white text-info border-1 border-info rounded py-1 px-4 text-capitalize m-l">
                review & forward
              </button>
              <button className="bg-white text-success border-1 border-success rounded py-1 px-4 text-capitalize m-l">
                approve
              </button>
              <button className="bg-white text-danger border-1 border-danger rounded py-1 px-4 text-capitalize">
                reject
              </button>
            </div>
          </div>
        </SimpleCard>
        <SimpleCard title="Requester">
          <div className="d-flex justify-content-between w-50">
            <Stack spacing={2} width="100%" overflow="auto">
              <div className="fw-bold text-capitalize ">names:</div>
              <div className="fw-bold text-capitalize ">role: </div>
            </Stack>
            <Stack spacing={2} width="100%" overflow="auto">
              <div className=" text-capitalize "> {request?.requestedBy?.firstName} {request?.requestedBy?.lastName} </div>
              <div className=" text-capitalize "> {request?.requestedBy?.role?.label}  </div>
            </Stack>
          </div>
        </SimpleCard>
        <SimpleCard title="Approver">
          <div className="d-flex justify-content-between w-50">
            <Stack spacing={2} width="100%" overflow="auto">
              <div className="fw-bold text-capitalize ">names:</div>
              <div className="fw-bold text-capitalize ">role: </div>
            </Stack>
            <Stack spacing={2} width="100%" overflow="auto">
              <div className=" text-capitalize "> {request?.approvedBy?.firstName} {request?.approvedBy?.lastName} </div>
              <div className=" text-capitalize "> {request?.approvedBy?.role?.label}  </div>
            </Stack>
          </div>
        </SimpleCard>
        <SimpleCard title="Request Letter">
          <JoditEditor
            required
            className='mb-4'
            ref={editor}
            value={content}
            onBlur={newContent => setContent(newContent)}
            onChange={newContent => { }}
          />
        </SimpleCard>
        <SimpleCard title="Supporting Document">
          <div className="bg-secondary py-2 px-4 rounded text-white fw-bold d-flex" style={{ width: "20%" }}>
            <span>{request?.documents}</span> <IconButton className="text-white"> <Icon>visibility</Icon> </IconButton>
          </div>
        </SimpleCard>
        <SimpleCard title="Request Process">
          {
            request?.requestProcess?.map((process, index) => {
              return (
                <div key={index} className="">
                  <div className="p-0"> <IconButton color="warning"><Icon>fiber_manual_record</Icon></ IconButton> <span> {request?.status}</span> - {process?.createdBy?.firstName} {process?.createdBy?.lastName} - {moment(process?.createdAt).format("DD-MM-yyyy HH:mm")}</div>
                </div>
              )
            })
          }
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default Details;
