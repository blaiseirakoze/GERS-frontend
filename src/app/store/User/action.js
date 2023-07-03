import { dispatchHandler } from "../helpers/dispatchHandler";
import axios from "axios";
import {
    ERROR,
    USER_INFO,
} from "./type";
const header = {
    headers: { "access-token": localStorage.getItem("token") },
};

export const systemLogin =
    (request) =>
        async (dispatch) => {
            try {
                const URL = `/api/user/sign-in`;
                const { data } = await axios.post(URL, request);
                if (data) {
                    localStorage.setItem("token", data.accessToken);
                    localStorage.setItem("user", JSON.stringify(data.data));

                    dispatchHandler({
                        type: USER_INFO,
                        data: data.data,
                        dispatch,
                    });
                    window.location.href = "/admin/dashboard";
                }
                return data;
            } catch (error) {
                console.log(error)
                dispatchHandler({
                    type: ERROR,
                    data: error?.data?.message,
                    dispatch,
                });
                return null;
            }
        };

export const getLoggedUser =
    () =>
        async (dispatch) => {
            try {

                const data = JSON.parse(localStorage.getItem("user"));
                dispatchHandler({
                    type: USER_INFO,
                    data: data,
                    dispatch,
                });

            } catch (error) {

            }
        };
