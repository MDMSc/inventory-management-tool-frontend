import React, { useState, useEffect, useContext } from "react";
import Pagination from "./Pagination";
import "../css/table.css";
import { Input, Button, Row, Col, InputGroup, Table, Alert, Tooltip } from "reactstrap";
import { API } from "../Global";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImSortAmountAsc } from "react-icons/im";
import { ImSortAmountDesc } from "react-icons/im";
import { AiFillEye } from "react-icons/ai";
import { HiPencil } from "react-icons/hi";
import { ImBin } from "react-icons/im";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ParentContext from "../reducer/Context";

let PageSize = 5;

export default function ProductTable(args) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTableData, setCurrentTableData] = useState({});
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState(true);
  const [isSort, setIsSort] = useState(false);
  const [sortType, setSortType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  let urlQuery = "";
  const navigate = useNavigate();
  const context = useContext(ParentContext);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  function handleSearchClick(e) {
    e.preventDefault();
    setSearchText(search);
    setIsLoading(true);
  }

  function handleDelete(pid) {
    fetch(`${API}/assets/${pid}`, { method: "DELETE" })
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

  async function getProducts() {
    if (type !== "select" && type !== "") {
      urlQuery += `&&type=${type}`;
    }
    if (brand !== "select" && brand !== "") {
      urlQuery += `&&brand=${brand}`;
    }
    if (searchText !== "") {
      urlQuery += `&&search=${searchText}`;
    }
    if (isSort) {
      urlQuery += `&&sort=${sortType}`;
    }

    const result = await fetch(
      `${API}/assets?page=${currentPage}${urlQuery}`,
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
        setError("Product " + result.statusText + ". Kindly refresh the page.");
        setIsLoading(true);
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(true);
    }
  }
  
  useEffect(() => {
    getProducts();
  }, [isLoading, currentPage]);

  let types = ["select"],
    brands = ["select"];

  try {
    if (Object.keys(currentTableData).length > 1) {
      if (isLoading === false) {
        currentTableData &&
          currentTableData.filters &&
          currentTableData.filters.forEach((item) => {
            if (!types.includes(item.type)) {
              types.push(item.type);
            }
            if (!brands.includes(item.brand)) {
              brands.push(item.brand);
            }
          });
      }
    }
  } catch (e) {
    setError(e.message);
    setIsLoading(true);
  }

  return (
    <>
      <div className="search-filter-area">
        <Row>
          <Col lg={4} md={4} sm={12}>
            <InputGroup className="my-2">
              <Input
                placeholder="Search by Name or Product ID ONLY..."
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
          <Col lg={1} md={1} sm={12}>
            <label className="my-2">Filter:</label>
          </Col>

          <Col lg={2} md={2} sm={6}>
            <label className="my-2">Type</label>
            <Input
              id="filter_type"
              name="filter_type"
              type="select"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCurrentPage(1);
                setIsLoading(true);
              }}
            >
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                types.map((item) => {
                  return (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  );
                })
              )}
            </Input>
          </Col>

          <Col lg={2} md={2} sm={6}>
            <label className="my-2">Brand</label>
            <Input
              id="filter_brand"
              name="filter_brand"
              type="select"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setCurrentPage(1);
                setIsLoading(true);
              }}
            >
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                brands.map((item) => {
                  return (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  );
                })
              )}
            </Input>
          </Col>
        </Row>
      </div>

      <Button id="addProduct" color="dark" outline size="sm" onClick={() => navigate("/add-product")}>
        <AiOutlinePlus />
      </Button>
      <Tooltip
        {...args}
        isOpen={tooltipOpen}
        target="addProduct"
        toggle={toggle}
      >
        Add New Product
      </Tooltip>

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
              <th>
                PRICE(in Rs.)
                {sort ? (
                  <Button
                    color="dark"
                    outline
                    size="sm"
                    className="mx-3"
                    id="sortButton"
                    onClick={() => {
                      setIsSort(true);
                      setSort(!sort);
                      setSortType("price-desc");
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
                      setIsSort(true);
                      setSort(!sort);
                      setSortType("price-asc");
                      setCurrentPage(1);
                      setIsLoading(true);
                    }}
                  >
                    <ImSortAmountAsc />
                  </Button>
                )}
              </th>
              <th>QUANTITY</th>
              <th>AMOUNT(in Rs.)</th>
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
                    <td>{item.price}</td>
                    <td>{item.inStockQty}</td>
                    <td>{item.price * item.inStockQty}</td>
                    <td>
                      <Button
                        color="dark"
                        outline
                        size="sm"
                        onClick={() =>
                          navigate(`/view-product/${item.productID}`)
                        }
                      >
                        <AiFillEye color="purple" />
                      </Button>{" "}

                      {
                        context.state.isAdmin && (
                          <>
                            <Button
                        color="dark"
                        outline
                        size="sm"
                        onClick={() =>
                          navigate(`/edit-product/${item.productID}`)
                        }
                      >
                        <HiPencil color="green" />
                      </Button>{" "}

                      <Button
                        color="dark"
                        outline
                        size="sm"
                        onClick={() => {
                          handleDelete(item.productID);
                          setTimeout(() => {
                            navigate("/inventory");
                          }, 3000);
                        }}
                      >
                        <ImBin color="red" />
                      </Button>
                          </>
                        )
                      }
                      
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
