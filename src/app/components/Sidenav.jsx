import { Fragment } from "react";
import Scrollbar from "react-perfect-scrollbar";
import { styled } from "@mui/material";
import { MatxVerticalNav } from "app/components";
import useSettings from "app/hooks/useSettings";
import { navigations } from "app/navigations";
import jwtDecode from "jwt-decode";

const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  position: "relative",
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: "100vw",
  background: "rgba(0, 0, 0, 0.54)",
  zIndex: -1,
  [theme.breakpoints.up("lg")]: { display: "none" },
}));

const Sidenav = ({ children }) => {
  const { settings, updateSettings } = useSettings();

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = accessToken && jwtDecode(accessToken);
  const role = decodedToken?.userRole;
  const filteredNavigation = navigations.filter((nav) => {
    if (role === "risa") {
      return nav.name === "Dashboard" || nav.name !== "Configuration";
    }
    if (role === "supplier") {
      return nav.name === "Dashboard" || nav.name === "Tenders";
    }
    if (role === "company") {
      return nav.name === "Dashboard" || nav.name === "Requests" || nav.name === "Tenders";
    }
    return nav;
  });
  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        <MatxVerticalNav items={filteredNavigation} />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
};

export default Sidenav;
