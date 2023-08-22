import { LoadingButton } from "@mui/lab";
import { Alert, Card, Checkbox, Grid, TextField } from "@mui/material";
import { Box, styled, useTheme } from "@mui/material";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
// import { userLogin } from '../../store/user/actions';
import { Formik } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "../../store/helpers/axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { mapStateToProps } from "app/store/helpers/mapState";
import { mapDispatchToProps } from "app/store/helpers/mapDispatch";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(Box)(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

// inital login credentials
const initialValues = {
  username: "jason@ui-lib.com",
  password: "dummyPass",
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  username: Yup.string()
    .email("Invalid Email address")
    .required("Email is required!"),
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    error: false,
    message: "",
  });
  const { login } = useAuth();

  // const handleFormSubmit = async (values) => {
  //   setLoading(true);
  //   try {
  //     // await login(values.email, values.password);
  //     // await userLogin({ username: values.email, password: values.password });
  //     navigate('/');
  //   } catch (e) {
  //     setLoading(false);
  //   }
  // };

  const handleFormSubmit = async (values) => {
    try {
      let url = "/auth/signin";
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "post";
      const { data } = await axios({ method, headers, url, data: values });
      const accessToken = data?.accessToken;
      if (data) {
        localStorage.setItem("accessToken", accessToken);
        window.location.replace("/dashboard/default");
      }
      window.location.replace("/dashboard/default");
    } catch (error) {
      setAlert({
        ...alert,
        error: true,
        message: error?.response?.data?.message,
      });
    }
  };
  
  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, error: false, message: "" });
  }
  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img
                src="/assets/images/illustrations/dreamer.svg"
                width="100%"
                alt=""
              />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
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
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="username"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};
export default JwtLogin;
