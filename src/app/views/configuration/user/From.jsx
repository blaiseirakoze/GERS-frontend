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
  const user = location?.state;

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, error: false, message: "" });
  }

  const [state, setState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: { value: "", label: "" },
    gender: "",
  });
  const navigate = useNavigate();

  // update user
  const handleSubmit = async (event) => {
    try {
      const url = `/user/create`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "post";
      const { data } = await axios({
        method,
        headers,
        url,
        data: { ...state, roleId: state.role.value },
      });
      // toast.success(data?.message);
      navigate("/configuration/users");
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message.toString(),
      });
    }
  };

  // create user
  const handleUpdate = async (event) => {
    try {
      const url = `/user/update/${user?.id}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "put";
      const { data } = await axios({
        method,
        headers,
        url,
        data: { ...state, roleId: state.role.value },
      });
      // toast.success(data?.message);
      navigate("/configuration/users");
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message?.toString(),
      });
    }
  };

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
    } catch (error) {}
  };

  useEffect(() => {
    getRoles();
    if (location?.pathname === `/configuration/users/update/${user?.id}`) {
      setState({
        ...state,
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        role: { value: user?.role?.id, label: user?.role?.name },
      });
      setIsUpdate(true);
    }
  }, []);

  const handleChange = (event) => {
    // event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { username, firstName, lastName, email, phone, roleId, gender } = state;

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Configuration", path: "/configuration/users" },
            { name: "User", path: "/configuration/users" },
            { name: "form" },
          ]}
        />
      </Box>
      <Stack spacing={3}>
        <SimpleCard title={isUpdate ? "Update User" : `Create User`}>
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
            <ValidatorForm
              onSubmit={isUpdate ? handleUpdate : handleSubmit}
              onError={() => null}
            >
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={email || ""}
                    onChange={handleChange}
                    validators={["required", "isEmail"]}
                    errorMessages={[
                      "this field is required",
                      "email is not valid",
                    ]}
                  />
                  <TextField
                    type="text"
                    name="firstName"
                    label="First Name"
                    onChange={handleChange}
                    value={firstName || ""}
                    // validators={["required"]}
                    // errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="lastName"
                    label="Last Name"
                    onChange={handleChange}
                    value={lastName || ""}
                    // validators={["required"]}
                    // errorMessages={["this field is required"]}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <ReactSelect
                    value={state?.role}
                    name="roleId"
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: 7,
                        marginBottom: 18,
                      }),
                    }}
                    required
                    options={roles?.map((role) => ({
                      value: role.id,
                      label: role.label,
                    }))}
                    onChange={(v) => setState({ ...state, role: v })}
                  />
                  <TextField
                    type="text"
                    name="username"
                    id="standard-basic"
                    value={username || ""}
                    onChange={handleChange}
                    errorMessages={["this field is required"]}
                    label="Username"
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="phone"
                    label="Phone"
                    onChange={handleChange}
                    value={phone || ""}
                    errorMessages={["this field is required"]}
                    validators={[
                      "required",
                      "minStringLength:10",
                      "maxStringLength: 10",
                    ]}
                  />
                </Grid>
              </Grid>
              <div className="text-end">
                <Button
                  onClick={() => navigate("/configuration/users")}
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
                    {isUpdate ? "Update" : "Submit"}
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
