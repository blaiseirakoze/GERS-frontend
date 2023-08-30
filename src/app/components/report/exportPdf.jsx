import React from "react";
import { ExportCSV } from "./exportCvs";
import { FaRegFilePdf } from "react-icons/fa";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Close, DoneAll } from "@material-ui/icons";
import { Button, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
}));

const ExportPdf = ({ reportData }) => {
  let columnRes = Object(reportData)[0] && Object.keys(Object(reportData)[0]);

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columnRes &&
                columnRes.map((column, i) => (
                  <TableCell key={i}>{columnRes && column}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData &&
              reportData.map((row, c) => (
                <TableRow key={c}>
                  {reportData &&
                    reportData.map((item) => {
                      return (
                        <TableCell>
                          {typeof item === "object" ? "N/A" : item}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))}
            {/* {
            reportData && reportData.length > 0 ? (
              (rowsPerPage > 0
                ? reportData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                :
                 reportData
              )
              .map((row, c) => (
                <TableRow key={c}>
                  {reportData &&
                    reportData.map((item) => {
                      return (
                        <TableCell>
                          {typeof item === "object" ? "N/A" : item}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center">No data</TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {reportData && reportData.length > 0 ? (
        <ExportCSV csvData={reportData} fileName={"Report"} />
      ) : (
        ""
      )} */}
      {reportData && reportData.length > 0 ? (
        <Link
          to="/export-pdf"
          style={{ color: "#000", textDecoration: "none" }}
        >
          <Button
            type="submit"
            aria-label="submit"
            variant="contained"
            color="primary"
            style={{
              float: "left",
              marginTop: "10px",
              marginLeft: "5px",
              textTransform: "capitalize",
              backgroundColor: "#de5226",
            }}
            disableElevation
          >
            Export pdf
            <FaRegFilePdf
              style={{
                width: "40px",
                height: "18px",
              }}
            />
          </Button>
        </Link>
      ) : (
        ""
      )}
    </Paper>
  );
};

export default ExportPdf;
