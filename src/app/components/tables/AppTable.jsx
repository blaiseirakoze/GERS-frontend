import { Breadcrumb, SimpleCard } from "app/components";
import PaginationTable from "./PaginationTable";
import SimpleTable from "./SimpleTable";
import { Box, Button, Fab, Icon, IconButton, styled } from '@mui/material';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppButtonRoot = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
  '& .button': { margin: theme.spacing(1) },
  '& .input': { display: 'none' },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const AppTable = () => {
  return (
    <Container>
      <Box className="breadcrumb d-flex justify-content-between">
        <Breadcrumb  routeSegments={[{ name: "Material", path: "/material" }, { name: "Table" }]} />
        <StyledButton  variant="contained" color="primary">
          Add new
        </StyledButton>
      </Box>

      <SimpleCard title="Pagination Table">
        <PaginationTable />
      </SimpleCard>
    </Container>
  );
};

export default AppTable;
