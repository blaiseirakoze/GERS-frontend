import { Stack } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
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
    Snackbar
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm, SelectValidator } from "react-material-ui-form-validator";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../store/helpers/axios";
import { amber, green } from '@mui/material/colors';
import { default as ReactSelect } from "react-select";
import JoditEditor from 'jodit-react';
import { useRef } from 'react';

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: { marginBottom: '16px' }
    }
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
        message: ""
    });
    const [content, setContent] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [users, setUsers] = useState([]);

    const editor = useRef(null);
    const location = useLocation();
    const user = location?.state;

    function handleClose(_, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, error: false, message: "" });
    }

    const [state, setState] = useState({
        documents: [],
        approver: { value: "", label: "" },
    });
    const [doc, setDoc] = useState();
    const {
        documents, approver
    } = state;
    const navigate = useNavigate();

    // update user
    const handleSubmit = async (event) => {
        try {
            const url = `/request/create`;
            const headers = {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json, multipart/form-data, */*"
            };
            const method = "post";
            const info = new FormData();
            info.append("documents", doc);
            info.append("approver", approver.value);
            info.append("reason", content);
            const { data } = await axios({ method, headers, url, data: info });
            if (data) {
                navigate("/requests");
            }
        } catch (error) {
            setAlert({ ...alert, error: true, message: error?.response?.data?.message.toString() })
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
            const { data } = await axios({ method, headers, url, data: { ...state, roleId: state.role.value, documents: documents } });
            // toast.success(data?.message);
            navigate("/configuration/users");
        } catch (error) {
            setAlert({ ...alert, error: true, message: error?.response?.data?.message?.toString() })
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
        } catch (error) {
        }
    }

    // get Users
    const getUsers = async (roleId) => {
        try {
            const url = `/user/search?roleId=${roleId}`;
            const headers = {
                "Content-Type": "application/json",
            };
            const method = "get";
            const { data } = await axios({ method, headers, url });
            setUsers(data?.data);
        } catch (error) {
        }
    }

    useEffect(() => {
        getRoles();
        if (location?.pathname === `/configuration/users/update/${user?.id}`) {
            setState({
                ...state, username: user?.username,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                phone: user?.phone,
                role: { value: user?.role?.id, label: user?.role?.name }
            });
            setIsUpdate(true);
        }
    }, []);

    useEffect(() => {
        const roleId = roles?.find((role) => role.name === "approver")?.id;
        getUsers(roleId);
    }, [roles]);

    const handleChange = (event) => {
        event.persist();
        if (event.target.type === "file") {
            setDoc(event.target.files[0]);
        }
        setState({ ...state, [event.target.name]: event.target.value });
    };

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Create", path: "/requests" }, { name: "form" }]} />
            </Box>
            <Stack spacing={3}>
                <SimpleCard title={isUpdate ? "Update Request" : `Create Request`} padding={'20px 24px 80px 24px'}>
                    {alert?.error ?
                        <Alert onClose={handleClose} sx={{ m: 1 }} severity="error" variant="filled">
                            {alert?.message}
                        </Alert> : null
                    }
                    <div>
                        <ValidatorForm onSubmit={isUpdate ? handleUpdate : handleSubmit} onError={() => null}>
                            <Grid container spacing={6}>
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                    <div>
                                        <label htmlFor="">Request Letter <span className='text-danger'>*</span></label>
                                        <JoditEditor
                                            required
                                            className='mb-4'
                                            ref={editor}
                                            value={content}
                                            // config={config}
                                            // tabIndex={1} // tabIndex of textarea
                                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                            onChange={newContent => { }}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="">Supporting document(s)</label>
                                        <TextField
                                            type="file"
                                            name="documents"
                                            // label="supporting Documents"
                                            onChange={handleChange}
                                            value={documents || ""}
                                        // validators={["required"]}
                                        // errorMessages={["this field is required"]}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="">Select approver <span className='text-danger'>*</span> </label>
                                        <ReactSelect
                                            className='z-3 bg-white'
                                            value={approver}
                                            name="roleId"
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    padding: 7,
                                                    marginBottom: 18
                                                }),
                                            }}
                                            required
                                            options={
                                                users?.map((user) => ({ value: user.id, label: `${user.firstName} ${user.lastName} (${user.role.label})` }))
                                            }
                                            onChange={(v) => setState({ ...state, approver: v })} />
                                    </div>
                                </Grid>
                            </Grid>
                            <div className='text-end'>
                                <Button
                                    onClick={() => navigate("/requests")}
                                    color="primary"
                                    variant="outlined"
                                    type="button">
                                    <Icon>cancel</Icon>
                                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>Cancel</Span>
                                </Button>
                                <Button color="primary" variant="contained" type="submit">
                                    <Icon>send</Icon>
                                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>{isUpdate ? "Update" : "Submit"}</Span>
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
