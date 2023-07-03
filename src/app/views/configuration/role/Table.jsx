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
  const [roles, setRoles] = useState([]);

  // get roles
  const getRoles = async () => {
    try {
      const url = `/role/view`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setRoles(data?.data);
    } catch (error) {
    }
  }


  useEffect(() => {
    getRoles();
  }, []);

  return (
    <Container>
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb routeSegments={[{ name: "Configuration", path: "/configuration/roles" }, { name: "Roles" }]} />
        {/* <StyledButton
          onClick={() => navigate("create")}
          variant="contained" color="primary">
          Add new
        </StyledButton> */}
      </Box>

      <SimpleCard title="Roles">
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">CreatedAt</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.
                slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                map((role, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{role.label}</TableCell>
                    <TableCell align="center">{moment(role.createdAt).format("DD-MM-yyyy")}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => navigate(`update/${role.id}`, { state: role })}
                        title="update">
                        <Icon color="info">edit</Icon>
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
            count={roles.length}
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
