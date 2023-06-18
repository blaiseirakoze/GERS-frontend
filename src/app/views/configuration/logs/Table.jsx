import { Breadcrumb, SimpleCard } from "app/components";
import axios from "../../../store/helpers/axios";
import { useEffect, useState } from "react";
import {
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
} from "@mui/material";
import ConfirmationDialog from "app/components/dialog/ConfirmationDialog";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
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

const Logs = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState("");
  const [logs, setLogs] = useState([]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // get logs
  const getLogs = async () => {
    try {
      const url = `/logs/view`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setLogs(data?.data);
    } catch (error) {
    }
  }

  // handle delete
  const handleDelete = async () => {
    try {
      const url = `/logs/delete/${id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "delete";
      await axios({ method, headers, url });
      getLogs();
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
    getLogs();
  }, []);

  return (
    <Container>
      <ConfirmationDialog
        title={"Delete Logs"}
        message={"Are you sure you want to delete this?"}
        action={handleDelete}
        handleClose={handleCloseDelete}
        open={openDelete} />
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb routeSegments={[{ name: "Configuration", path: "/configuration/logs" }, { name: "Logs" }]} />
      </Box>

      <SimpleCard title="Users">
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow className="text-capitalize">
                <TableCell align="left">action</TableCell>
                <TableCell align="center">module</TableCell>
                <TableCell align="center">description</TableCell>
                <TableCell align="center">ip</TableCell>
                <TableCell align="center">browser</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs?.
                slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                map((log, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{log.action}</TableCell>
                    <TableCell align="center">{log.module}</TableCell>
                    <TableCell align="center">{log.description}</TableCell>
                    <TableCell align="center">{log?.ip}</TableCell>
                    <TableCell align="center">{log?.browser}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { handleOpenDelete(log?.id) }}>
                        <Icon title="delete" color="error">close</Icon>
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
            count={logs?.length}
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

export default Logs;
