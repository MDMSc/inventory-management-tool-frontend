import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import "../css/table.css";
import { Input, Button, Row, Col, InputGroup, Table, Alert } from "reactstrap";
import { API } from "../Global";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImSortAmountAsc } from "react-icons/im";
import { ImSortAmountDesc } from "react-icons/im";
import { ImBin } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import moment from "moment";

let PageSize = 5;

export default function ProductTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTableData, setCurrentTableData] = useState({});
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAmt, setSortAmt] = useState(true);
  const [sortDate, setSortDate] = useState(true);
  const [isSortAmt, setIsSortAmt] = useState(false);
  const [isSortDate, setIsSortDate] = useState(false);
  const [sortType, setSortType] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  let urlQuery = "";

  function handleSearchClick(e) {
    e.preventDefault();
    setSearchText(search);
    setIsLoading(true);
  }

  function handleDelete(pid) {
    fetch(`${API}/sell-assets/${pid}`, { method: "DELETE" })
      .then(async (result) => {
        const data = await result.json();

        if (!result.ok) {
          const error = (data && data.message) || result.status;
          setError(error);
          return Promise.reject(error);
        }
        setDeleteSuccess(
          `${data.message}. Kindly Refresh the Page to check the Inventory.`
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  useEffect(() => {
    async function getProducts() {
      if (searchText !== "") {
        urlQuery += `&&search=${searchText}`;
      }
      if (sortType !== "") {
        if (isSortAmt || isSortDate) {
          if (isSortDate) {
            urlQuery += `&&sort=${sortType}`;
          } else {
            urlQuery += `&&sort=${sortType}`;
          }
        }
      }

      const result = await fetch(
        `${API}/sell-assets?page=${currentPage}${urlQuery}`,
        {
          method: "GET",
        }
      );
      const data = await result.json();
      setIsLoading(false);
      setCurrentTableData({ ...data, status: result.status });

      try {
        if (result.ok === true) {
          if (result.status === 200) {
            return;
          } else {
            setError(result.statusText);
            setIsLoading(true);
          }
        } else {
          setError(
            "Sell record " + result.statusText + ". Kindly refresh the page."
          );
          setIsLoading(true);
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(true);
      }
    }

    getProducts();
  }, [isLoading, currentPage]);

  return (
    <>
      <div className="search-filter-area">
        <Row>
          <Col lg={4} md={4} sm={12}>
            <InputGroup className="my-2">
              <Input
                placeholder="Search by Product ID or Type ONLY..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Button color="primary" onClick={handleSearchClick}>
                Search
              </Button>
            </InputGroup>
          </Col>
          <Col lg={2} md={2} sm={1}></Col>
        </Row>
      </div>

      {deleteSuccess !== "" ? (
        <Alert color="success">{deleteSuccess}</Alert>
      ) : (
        ""
      )}
      {error !== "" ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>PRODUCT ID</th>
              <th>NAME</th>
              <th>TYPE</th>
              <th>BRAND</th>
              <th>GENDER</th>
              <th>SIZE</th>
              <th>QUANTITY</th>
              <th>
                AMOUNT(in Rs.)
                {sortAmt ? (
                  <Button
                    color="dark"
                    outline
                    size="sm"
                    className="mx-3"
                    id="sortButton"
                    onClick={() => {
                      setIsSortAmt(true);
                      setSortAmt(!sortAmt);
                      setSortType("amount-desc");
                      setCurrentPage(1);
                      setIsLoading(true);
                    }}
                  >
                    <ImSortAmountDesc />
                  </Button>
                ) : (
                  <Button
                    color="dark"
                    outline
                    size="sm"
                    className="mx-3"
                    id="sortButton"
                    onClick={() => {
                      setIsSortAmt(true);
                      setSortAmt(!sortAmt);
                      setSortType("amount-asc");
                      setCurrentPage(1);
                      setIsLoading(true);
                    }}
                  >
                    <ImSortAmountAsc />
                  </Button>
                )}
              </th>
              <th>
                SELLING DATE
                {sortDate ? (
                  <Button
                    color="dark"
                    outline
                    size="sm"
                    className="mx-3"
                    id="sortButton"
                    onClick={() => {
                      setIsSortDate(true);
                      setSortDate(!sortDate);
                      setSortType("date-desc");
                      setCurrentPage(1);
                      setIsLoading(true);
                    }}
                  >
                    <ImSortAmountDesc />
                  </Button>
                ) : (
                  <Button
                    color="dark"
                    outline
                    size="sm"
                    className="mx-3"
                    id="sortButton"
                    onClick={() => {
                      setIsSortDate(true);
                      setSortDate(!sortDate);
                      setSortType("date-asc");
                      setCurrentPage(1);
                      setIsLoading(true);
                    }}
                  >
                    <ImSortAmountAsc />
                  </Button>
                )}
              </th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td>
                  <h3>Loading...</h3>
                </td>
              </tr>
            ) : (
              currentTableData.list.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.productID}</td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.brand}</td>
                    <td>{item.gender}</td>
                    <td>{item.size}</td>
                    <td>{item.soldQty}</td>
                    <td>{item.amount}</td>
                    <td>
                      {moment(item.createdAt).format("DD/MMM/YYYY, h:mm:ss a")}
                    </td>
                    <td>
                      <Button
                        color="dark"
                        outline
                        size="sm"
                        onClick={() => {
                          handleDelete(item._id);
                          setTimeout(() => {
                            navigate("/sold-inventory");
                          }, 3000);
                        }}
                      >
                        <ImBin color="red" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
      {!isLoading && currentTableData && currentTableData.productCount ? (
        <Pagination
          className="pagination-bar mt-3"
          currentPage={currentPage}
          totalCount={currentTableData.productCount[0].count}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      ) : (
        ""
      )}
    </>
  );
}
