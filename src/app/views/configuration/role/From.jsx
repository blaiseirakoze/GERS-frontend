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
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../store/helpers/axios";
import { amber, green } from "@mui/material/colors";
import { default as ReactSelect } from "react-select";

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

const Form = () => {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [alert, setAlert] = useState({
    error: false,
    message: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const location = useLocation();
  const role = location?.state;

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, error: false, message: "" });
  }

  const [state, setState] = useState({
    label: "",
  });
  const navigate = useNavigate();

  // create role
  const handleUpdate = async (event) => {
    try {
      const url = `/role/update/${role?.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      const { data } = await axios({ method, headers, url, data: state });
      // toast.success(data?.message);
      navigate("/configuration/roles");
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };

  useEffect(() => {
    setState({
      ...state,
      label: role.label,
    });
  }, []);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { label } = state;

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Configuration", path: "/configuration/roles" },
            { name: "Role", path: "/configuration/roles" },
            { name: "form" },
          ]}
        />
      </Box>
      <Stack spacing={3}>
        <SimpleCard title={"Update Role"}>
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
          <div>
            <ValidatorForm onSubmit={handleUpdate} onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="label"
                    label="Name"
                    onChange={handleChange}
                    value={label || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
              </Grid>
              <div className="text-end">
                <Button
                  onClick={() => navigate("/configuration/roles")}
                  color="primary"
                  variant="outlined"
                  type="button"
                >
                  <Icon>cancel</Icon>
                  <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                    Cancel
                  </Span>
                </Button>
                <Button color="primary" variant="contained" type="submit">
                  <Icon>send</Icon>
                  <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                    Update
                  </Span>
                </Button>
              </div>
            </ValidatorForm>
          </div>
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default Form;
