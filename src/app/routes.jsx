import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";
import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import Users from "./views/configuration/user/Table";
import Supplier from "./views/configuration/supplier/Table";
import Institutions from "./views/configuration/institution/Table";
import Roles from "./views/configuration/role/Table";
import Logs from "./views/configuration/logs/Table";
import Form from "./views/configuration/user/From";
import InstitutionForm from "./views/configuration/institution/From";

import Suppliers from "./views/configuration/supplier/Table";
import SupplierForm from "./views/configuration/supplier/From";

import RisaUsers from "./views/configuration/risa/Table";
import RisaForm from "./views/configuration/risa/From";

import RoleForm from "./views/configuration/role/From";

import Requests from "./views/request/Table";
import CreateRequest from "./views/request/From";
import RequestDetails from "./views/request/Details";
import Tenders from "./views/tender/Table";
import CreateTender from "./views/tender/From";
import TenderDetails from "./views/tender/Details";

// session pages
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(
  lazy(() => import("app/views/sessions/JwtRegister"))
);
const ForgotPassword = Loadable(
  lazy(() => import("app/views/sessions/ForgotPassword"))
);

// echart page
// const AppEchart = Loadable(lazy(() => import('app/views/charts/echarts/AppEchart')));

// dashboard page
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard", element: <Analytics /> },

      // configuration route
      { path: "/configuration", element: <Users /> },

      // { path: "/configuration/users", element: <Users /> },
      // { path: "/configuration/users/create", element: <Form /> },

      { path: "/configuration/roles/update/:id", element: <RoleForm /> },

      { path: "/configuration/institutions", element: <Institutions /> },
      {
        path: "/configuration/institutions/create",
        element: <InstitutionForm />,
      },
      {
        path: "/configuration/institutions/update/:id",
        element: <InstitutionForm />,
      },

      { path: "/configuration/suppliers", element: <Suppliers /> },
      { path: "/configuration/suppliers/create", element: <SupplierForm /> },
      {
        path: "/configuration/suppliers/update/:id",
        element: <SupplierForm />,
      },

      { path: "/configuration/risa", element: <RisaUsers /> },
      { path: "/configuration/risa/create", element: <RisaForm /> },
      { path: "/configuration/risa/update/:id", element: <RisaForm /> },

      { path: "/configuration/logs", element: <Logs /> },
      { path: "/configuration/roles", element: <Roles /> },

      // request route
      { path: "/requests", element: <Requests /> },
      { path: "/requests/create", element: <CreateRequest /> },
      { path: "/requests/update/:id", element: <CreateRequest /> },
      { path: "/requests/details/:id", element: <RequestDetails /> },

      // tender route
      { path: "/tenders", element: <Tenders /> },
      { path: "/tenders/create", element: <CreateTender /> },
      { path: "/tenders/update/:id", element: <CreateTender /> },
      { path: "/tenders/details/:id", element: <TenderDetails /> },
    ],
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="dashboard" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
