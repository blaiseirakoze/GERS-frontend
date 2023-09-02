import { Breadcrumb, SimpleCard } from "app/components";
import { useNavigate } from "react-router-dom";
import axios from "../../../store/helpers/axios";
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
  width: 50,
  height: 15,
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  overflow: 'hidden',
  background: bgcolor,
  boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}));

const Users = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgSuccess = palette.success.main;

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
  const [users, setUsers] = useState([]);

  // get users
  const getUsers = async () => {
    try {
      const url = `/user/view?role=risa`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setUsers(data?.data);
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
      getUsers();
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
    getUsers();
  }, []);

  return (
    <Container>
      <ConfirmationDialog
        title={"Delete user"}
        message={"Are you sure you want to delete this user?"}
        action={handleDelete}
        handleClose={handleCloseDelete}
        open={openDelete} />
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb routeSegments={[{ name: "Configuration", path: "/configuration/risa" }, { name: "risa" }]} />
        <StyledButton
          onClick={() => navigate("create")}
          variant="contained" color="primary">
          Add new
        </StyledButton>
      </Box>
      <SimpleCard title="Risa users">
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">CreatedAt</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.
                slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                map((user, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{user.firstName} {user.lastName}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.phone}</TableCell>
                    <TableCell align="center">{user?.role?.label}</TableCell>
                    <TableCell align="center">{moment(user.createdAt).format("DD-MM-yyyy")}</TableCell>
                    <TableCell align="center"> <Small bgcolor={user.status === "active" ? bgSuccess : bgError}>{user.status}</Small> </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => navigate(`update/${user.id}`, { state: user })}
                        title="update">
                        <Icon color="info">edit</Icon>
                      </IconButton>
                      <IconButton onClick={() => { handleOpenDelete(user?.id) }}>
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
            count={users.length}
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

export default Users;
