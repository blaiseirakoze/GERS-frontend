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
import DatatableComponent from "app/components/Datatable";

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
  const [tenders, setTenders] = useState([]);

  // get tendes
  const getTenders = async () => {
    try {
      const url = `/tender/view`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setTenders(data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getTenders();
  }, []);

  // ======================================  columns ==========================
  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        sort: true,
      },
    },
    {
      name: "Open Date",
      label: "openDate",
      options: {
        sort: true,
        customBodyRender: (date) => moment(date?.openDate).format("DD-MM-yyyy"),
      },
    },
    {
      name: "Close Date",
      label: "closeDate",
      options: {
        sort: true,
        customBodyRender: (date) =>
          moment(date?.closeDate).format("DD-MM-yyyy"),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        sort: true,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        sort: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <IconButton
              onClick={() => {
                navigate(`details/${tenders[rowIndex]?.id}`, {
                  state: tenders[rowIndex],
                });
              }}
            >
              <Icon title="more details" color="info">
                info
              </Icon>
            </IconButton>
          );
        },
      },
    },
  ];

  return (
    <Container>
      {/* <ConfirmationDialog
        title={"Delete Tender"}
        message={"Are you sure you want to delete this request?"}
        action={handleDelete}
        handleClose={handleCloseDelete}
        open={openDelete} /> */}
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb
          routeSegments={[
            { name: "Tender", path: "/tenders" },
            { name: "Tenders" },
          ]}
        />
        {/* <StyledButton
          onClick={() => navigate("create")}
          variant="contained" color="primary">
          Add new
        </StyledButton> */}
      </Box>

      <DatatableComponent
        title={"Tenders"}
        processData={(data) => {
          setTenders(data?.data?.data);
          return data?.data;
        }}
        columns={columns}
        url={`/tender/datatable`}
      />

      {/* <SimpleCard title="Tenders">
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Open Date</TableCell>
                <TableCell align="center">Close Date</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenders?.
                slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                map((tender, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{tender?.name}</TableCell>
                    <TableCell align="center">{moment(tender?.openDate).format("DD-MM-yyyy")}</TableCell>
                    <TableCell align="center">{moment(tender?.closeDate).format("DD-MM-yyyy")}</TableCell>
                    <TableCell align="center">{tender.status}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { navigate(`details/${tender?.id}`, { state: tender }) }}>
                        <Icon title="more details" color="info">info</Icon>
                      </IconButton>
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
            count={tenders.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </Box>
      </SimpleCard> */}
    </Container>
  );
};

export default Requests;
