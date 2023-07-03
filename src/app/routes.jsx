import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from './auth/AuthGuard';
import { authRoles } from './auth/authRoles';
import Loadable from './components/Loadable';
import MatxLayout from './components/MatxLayout/MatxLayout';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import Users from './views/configuration/user/Table';
import Institutions from './views/configuration/institution/Table';
import Roles from './views/configuration/role/Table';
import Logs from './views/configuration/logs/Table';
import Form from './views/configuration/user/From';
import InstitutionForm from './views/configuration/institution/From';
import Requests from "./views/request/Table";
import CreateRequest from "./views/request/From";
import RequestDetails from "./views/request/Details";
import Tenders from "./views/tender/Table";
import CreateTender from "./views/tender/From";
import TenderDetails from "./views/tender/Details";

// session pages
const NotFound = Loadable(lazy(() => import('app/views/sessions/NotFound')));
const JwtLogin = Loadable(lazy(() => import('app/views/sessions/JwtLogin')));
const JwtRegister = Loadable(lazy(() => import('app/views/sessions/JwtRegister')));
const ForgotPassword = Loadable(lazy(() => import('app/views/sessions/ForgotPassword')));

// echart page
// const AppEchart = Loadable(lazy(() => import('app/views/charts/echarts/AppEchart')));

// dashboard page
const Analytics = Loadable(lazy(() => import('app/views/dashboard/Analytics')));

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
      {path: '/dashboard/default',element: <Analytics />,auth: authRoles.admin},

      // configuration route
      {path: '/configuration',element: <Users />, auth: authRoles.admin},
      {path: '/configuration/users',element: <Users />, auth: authRoles.admin},
      {path: '/configuration/users/create',element: <Form />,  auth: authRoles.admin},
      {path: '/configuration/users/update/:id',element: <Form />},
      {path: '/configuration/institutions',element: <Institutions />, auth: authRoles.editor},
      {path: '/configuration/institutions/create',element: <InstitutionForm />},
      {path: '/configuration/institutions/update/:id',element: <InstitutionForm />},
      {path: '/configuration/logs',element: <Logs />, auth: authRoles.editor},
      {path: '/configuration/roles',element: <Roles />},

      // request route
      {path: '/requests',element: <Requests />, auth: authRoles.editor},
      {path: '/requests/create',element: <CreateRequest />},
      {path: '/requests/update/:id',element: <CreateRequest />},
      {path: '/requests/details/:id',element: <RequestDetails />},

      // tender route
      {path: '/tenders',element: <Tenders />, auth: authRoles.editor},
      {path: '/tenders/create',element: <CreateTender />},
      {path: '/tenders/update/:id',element: <CreateTender />},
      {path: '/tenders/details/:id',element: <TenderDetails />},
    ]
  },

  // session pages route
  { path: '/session/404', element: <NotFound /> },
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/signup', element: <JwtRegister /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },

  { path: '/', element: <Navigate to="dashboard/default" /> },
  { path: '*', element: <NotFound /> }
];

export default routes;
