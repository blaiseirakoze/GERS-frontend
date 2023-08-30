import { Card, Grid, styled, useTheme } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import Campaigns from "./shared/Campaigns";
import DoughnutChart from "./shared/Doughnut";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import StatCards2 from "./shared/StatCards2";
import TopSellingTable from "./shared/TopSellingTable";
import UpgradeCard from "./shared/UpgradeCard";
import axios from "../../store/helpers/axios";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Analytics = () => {
const [dashboard, setDashboard] = useState();
  // get dashboard
  const getDashboard = async () => {
    try {
      const url = `/dashboard/view-dashboard`;
      const headers = {
        "Content-Type": "application/json",
      };
      const method = "get";
      const { data } = await axios({ method, headers, url });
      setDashboard(data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards dashboard={dashboard} />
            {/* <TopSellingTable /> */}

            {/* <H4>Ongoing Projects</H4>
            <RowCards /> */}
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            {/* <StatCards2 /> */}
            {/* <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Traffic Sources</Title>
              <SubTitle>Last 30 days</SubTitle>
              <DoughnutChart
                height="300px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
              />
            </Card> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
