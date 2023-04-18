import React, { useEffect, useState } from "react";
import "../styles/home.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QuestionDetails from "./addUser";
import { TableContainer } from "../styles/index.styled";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import makeGetRequest from "../api/getApi";

function 
HomePage() {
  const [open, setOpen] = useState(false);
  const [fetchValue, setFetchValue] = useState([]);
  const [data, setData1] = useState([]);
  const [mode, setMode] = useState("add");
  const initialvalues = {
    name: "",
    email: "",
    contactNo: "",
    location: "",
    id: "0",
  };
  useEffect(() => {
    api();
  }, [open]);
  const api = async () => {
    const result = await makeGetRequest("GET", `/user/api`, {});
    setData1(result.users);
  };

  const [data1, setData] = useState(initialvalues);
  const [columns, setColumns] = useState([
    { Header: "id", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Contact", accessor: "contactNo" },
    { Header: "Location", accessor: "location" },
    {
      Header: "Edit",
      disableGlobalFilter: true,
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return (
          <EditIcon
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              setData({ ...row.values });
              setMode("edit");
              setOpen(true);
            }}
          />
        );
      },
    },
    {
      Header: "Delete",
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <DeleteIcon
            style={{ cursor: "pointer" }}
            onClick={async (e) => {
              await makeGetRequest("DELETE", `/delete/${row.values.id}`, {
                name: data.name,
                email: data.email,

                contactNo: data.contactNo,
                location: data.location,
              });
              api();
            }}
          />
        );
      },
    },
  ]);
  const Header = [
    "Name",
    "Email",
    "Employee id",
    "Contact no",
    "Role",
    "Blood grp",
    "",
    "",
  ];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      data,
      columns,
      initialState: {
        pageSize: 5,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { globalFilter } = state;
  const handleClosed = () => {
    setOpen(false);
  };
  const editFunction = (item) => {
    setData({
      ...data,
      ["name"]: item.name,
      ["email"]: item.email,
      ["contactNo"]: item.contactNo,
      ["location"]: item.location,
    });
    setOpen(true);
  };
  return (
    <div className="container">
      <div className="dashBoardContainer">
        <div className="dashBoard"> DASHBOARD </div>
        <DashboardIcon className="DashBoardImage" />
      </div>
      <div>
        <div className="employeeDetailsCont">EMPLOYEE DETAILS</div>
      </div>
      
      <div className="searchContainer">
        <input
          className="inputCont"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div
          className="addUserButton1"
          onClick={() => {
            setData({
              ...data,
              ["name"]: "",
              ["email"]: "",
              ["contactNo"]: "",
              ["location"]: "",
            });
            setMode("add");
            setOpen(true);
          }}
        >
          + Add User
        </div>
      </div>
      <TableContainer>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}

                    {column.Header != "Edit" && column.Header != "Delete" && (
                      <span className="sortbutton">
                        {column.isSortedDesc ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableContainer>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        
      </div>
      <QuestionDetails
        show={open}
        data={data1}
        setData={setData}
        mode={mode}
        handleClosed={handleClosed}
      />
    </div>
  );
}

export default HomePage;
