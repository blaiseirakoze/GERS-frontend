import React, { useEffect } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableBodyRow,
} from "mui-datatables";
// import axios, { AxiosError } from "axios";
import axios from "../store/helpers/axios";

import { Refresh } from "@material-ui/icons";

// type IProps = {
//   columns: Array<any>;
//   url: string;
//   processData?: (data: any) => any;
//   title?: any;
//   elevation?:number,
//   useMeetingUrl?: boolean;
//   selectableRowsHideCheckboxes?:boolean;
//   onRowClick?: (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }) => void;
// };

// get data
const GetData = async (callback) => {
  callback();
};

const SerializeObject = (obj, prefix = null) => {
  let str = [],
    p;

  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + "[" + p + "]" : p;
      const v = obj[p];
      if (typeof v === "object") {
        str.push(SerializeObject(v, k));
      } else if (typeof v !== "function") {
        str.push(
          encodeURIComponent(k) + "=" + encodeURIComponent(v?.toString() ?? "")
        );
      }
    }
  }

  return str.join("&");
};

const DatatableComponent = (props) => {
  const {
    columns,
    url,
    title,
    processData,
    useMeetingUrl,
    elevation,
    onRowClick,
  } = props;

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [page, setPage] = React.useState(0);
  const [sortOrder, setSortOrder] = React.useState();
  const [count, setCount] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [error, setError] = React.useState();
  const [errorStatus, setErrorStatus] = React.useState();

  const preSetData = (reqData) => {
    if (reqData) {
      if (processData) {
        const { data, recordsFiltered, page } = processData(reqData);
        setError(null);
        setData(data);
        setCount(recordsFiltered);
        setPage(page);
      } else {
        setError(null);
        setData(reqData.data);
        setCount(reqData.recordsFiltered);
        setPage(reqData.page);
      }
    }
  };

  const fetchData = (rows, newPage) => {
    GetData(async () => {
      setLoading(true);
      const res = await xhrRequest(newPage ?? page, null, null, rows);
      preSetData(res);
      setLoading(false);
    }).then(() => {});
  };

  useEffect(() => {
    setPage(0);
    fetchData(undefined, 0);
  }, [GetData, url]);

  const sort = (page, sortOrder, append) => {
    setLoading(true);
    xhrRequest(page, sortOrder, append).then((res) => {
      preSetData(res);
      setLoading(false);
      setSortOrder(sortOrder);
    });
  };

  const search = (sortOrder, page, append) => {
    sort(page, sortOrder, append);
  };

  // mock async function
  const xhrRequest = async (page, sortOrder = null, append = null, rows) => {
    const header = {
      headers: { "access-token": localStorage.getItem("token") },
    };
    let char = url.includes("?") ? "&" : "?";
    const rows2 = rows ?? rowsPerPage ?? 0;
    const URL = `${url}${char}start=${
      (page ?? 0) * rows2
    }&length=${rows2}&${append}`;

    const headers = {
      "Content-Type": "application/json",
    };
    const method = "get";

    try {
      //   const { data } = await axios.get(URL, header);
      const { data } = await axios({ method, headers, url: URL });

      return data;
    } catch (e) {
      const err = e;
      if (err.response) {
        setErrorStatus(err.response.status);
        setError(err.response.data?.message);
      } else {
        setErrorStatus(500);
        setError("Connection refused");
      }
      setLoading(false);
      return null;
    }
  };

  const changePage = (page, sortOrder, append) => {
    setLoading(true);
    xhrRequest(page, sortOrder, append).then((res) => {
      setLoading(false);
      preSetData(res);
      setLoading(false);
      setSortOrder(sortOrder);
    });
  };

  const options = {
    filter: true,
    filterType: "dropdown",
    // responsive: "standard",
    enableNestedDataAccess: ".",
    // selectableRowsHideCheckboxes:selectableRowsHideCheckboxes??false,
    elevation: elevation ?? 0,
    serverSide: true,
    count: count,
    onRowClick,
    download: true,
    print: true,
    page: page,
    rowsPerPage: rowsPerPage,
    onChangeRowsPerPage: (numberOfRows) => {
      setRowsPerPage(numberOfRows);
      fetchData(numberOfRows);
    },
    rowsPerPageOptions: [10, 15, 30, 50, 70, 100],
    sortOrder: sortOrder,
    setTableProps: () => {
      return {
        // material ui v4 only
        size: "small",
      };
    },
    textLabels: {
      body: error
        ? {
            noMatch: (
              <div className={"text-left"}>
                <Alert
                  severity="error"
                  action={
                    <Button
                      endIcon={<Refresh />}
                      color="inherit"
                      onClick={() => fetchData()}
                    >
                      Refresh{" "}
                    </Button>
                  }
                >
                  <AlertTitle>Error ({errorStatus ?? ""})</AlertTitle>
                  {error} — <strong>check it out!</strong>
                </Alert>
              </div>
            ),
          }
        : undefined,
    },
    onTableChange: (action, tableState) => {
      let cols = {};
      for (let o in columns) {
        let obj = columns[o];
        let n = obj.data ?? obj.name;
        if (n && obj?.options?.filter !== false) {
          cols[n] = {
            data: n,
          };
        }
      }

      let object = {
        columns: cols,
      };

      if (tableState.searchText) {
        object.search = {
          value: tableState.searchText,
        };
      }

      if (tableState.sortOrder.name) {
        object.order = [
          {
            column: tableState.sortOrder.data ?? tableState.sortOrder.name,
            dir: tableState.sortOrder.direction,
          },
        ];
      }

      const append = SerializeObject(object);

      switch (action) {
        case "changePage":
          changePage(tableState.page, tableState.sortOrder, append);
          break;
        case "sort":
          sort(tableState.page, tableState.sortOrder, append);
          break;
        case "search":
          search(tableState.sortOrder, tableState.page, append);
          break;
      }
    },
  };

  // console.log('COLUMNS');
  // console.dir(JSON.parse(JSON.stringify(this.state.columns)));

  return (
    <div className={"position-relatives"}>
      {loading ? (
        <div
          className={
            "position-absolute h-100 w-100 top-0 left-0 d-flex justify-content-center align-items-center"
          }
        >
          <div
            className={"bg-white p-3 rounded-xl shadow-sm text-center"}
            style={{ zIndex: 20000 }}
          >
            <div>
              <CircularProgress color={"success"} />
            </div>
            <span>
              <Typography>Loading ....</Typography>
            </span>
          </div>
        </div>
      ) : null}
      <MUIDataTable
        title={
          title ?? (
            <Typography variant="h6">
              List
              {loading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
            </Typography>
          )
        }
        data={data}
        columns={columns&&columns}
        options={options}
      />
    </div>
  );
};

export default DatatableComponent;
