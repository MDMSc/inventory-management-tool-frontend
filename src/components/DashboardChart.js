import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";
import { API } from "../Global";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

export default function DashboardChart() {
  const [inStock, setInStock] = useState({});
  const [soldStock, setSoldStock] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  let urlQuery = "";

  async function getData() {
    if (year !== "") {
      urlQuery = `?year=${year}`;
    }
    try {
      const result = await Promise.all([
        fetch(`${API}/assets/assets-aggregation`, {
          method: "GET",
        }),
        fetch(`${API}/sell-assets/sold-assets-aggregation${urlQuery}`, {
          method: "GET",
        }),
      ]);
      const data = await Promise.all(result.map((r) => r.json()));
      if (isLoading && Object.keys(data).length) {
        setInStock(data[0]);
        setSoldStock(data[1]);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getData();
  }, [isLoading]);

  let pieLabels = [];
  let piedata = [];
  if (Object.keys(inStock).length) {
    if (!isLoading) {
        inStock &&
        inStock.inStockQtyByType &&
        inStock.inStockQtyByType.map((item) => {
        pieLabels.push(item._id);
        piedata.push(item.count);
        });
    }
  }

  let labels = [];
  let data = [];
  if (Object.keys(soldStock).length) {
    if (!isLoading) {
      soldStock &&
        soldStock.soldStockQtyByType &&
        soldStock.soldStockQtyByType.map((item) => {
          labels.push(item._id);
          data.push(item.count);
        });
    }
  }

  let monthLabels = [];
  let monthData = [];
  let date, month;
  if (Object.keys(soldStock).length) {
    if (!isLoading) {
      if (!soldStock.totalSellByMonth[0].hasOwnProperty("message")) {
        soldStock &&
          soldStock.totalSellByMonth &&
          soldStock.totalSellByMonth.map((item) => {
            date = new Date();
            date.setMonth(parseInt(item._id) - 1);
            month = date.toLocaleString("en-US", {
              month: "long",
            });
            monthLabels.push(month);
            monthData.push(item.count);
          });
      }
    }
  }

  return (
    <>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : error !== "" ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <div>
          <div className="dashboard-container">
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col lg={4} md={4} sm={12}>
                <div className="card1">
                  <h5>Total In-Stock Products</h5>
                  {inStock && inStock.totalInStockQty.length ? (
                    <h2>{inStock.totalInStockQty[0].count}</h2>
                  ) : (
                    <h2>0</h2>
                  )}
                </div>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <div className="card2">
                  <h5>Total Low-Stock Products</h5>
                  {inStock && inStock.totalLowStockQty.length ? (
                    <h2>{inStock.totalLowStockQty[0].count}</h2>
                  ) : (
                    <h2>0</h2>
                  )}
                </div>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <div className="card3">
                  <h5>Total Out-of-Stock Products</h5>
                  {inStock && inStock.totalOutStockQty.length ? (
                    <h2>{inStock.totalOutStockQty[0].count}</h2>
                  ) : (
                    <h2>0</h2>
                  )}
                </div>
              </Col>
            </Row>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col lg={4} md={4} sm={12}>
                <div className="card4">
                  <h5>Total In-Stock Amount(in Rs.)</h5>
                  {inStock && inStock.totalInStockAmt.length ? (
                    <h2>Rs. {inStock.totalInStockAmt[0].totalAmount}</h2>
                  ) : (
                    <h2>Rs. 0</h2>
                  )}
                </div>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <div className="card5">
                  <h5>Total Sold Product Items</h5>
                  {soldStock && soldStock.totalSold.length ? (
                    <h2>{soldStock.totalSold[0].count}</h2>
                  ) : (
                    <h2>0</h2>
                  )}
                </div>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <div className="card6">
                  <h5>Total Sold Amount(in Rs.)</h5>
                  {soldStock && soldStock.totalSold.length ? (
                    <h2>{soldStock.totalSold[0].totalAmount}</h2>
                  ) : (
                    <h2>Rs. 0</h2>
                  )}
                </div>
              </Col>
            </Row>
          </div>
 
          <div className="inStockchart-container">
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col lg={6} md={6} sm={12}>
                <div className="chart">
                    <h5>Pie Chart of In-Stock Products By Type</h5>
                {pieLabels.length && piedata.length && (
                    <PieChart
                      labels={pieLabels}
                      title="Pie Chart of In-Stock Products By Type"
                      data={piedata}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>

          <div className="soldStockchart-container">
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col lg={6} md={6} sm={12}>
                <div className="chart">
                  {labels.length && data.length && (
                    <BarChart
                      labels={labels}
                      title="Bar Chart of Sales By Type"
                      data={data}
                    />
                  )}
                </div>
              </Col>

              <Col lg={6} md={6} sm={12}>
                <label className="my-2">Year</label>
                <Input
                  id="filter_year"
                  name="filter_year"
                  type="select"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setIsLoading(true);
                  }}
                >
                  {isLoading ? (
                    <option>Loading...</option>
                  ) : (
                    soldStock &&
                    soldStock.totalSellByYear.length &&
                    soldStock.totalSellByYear.map((item) => {
                      return (
                        <option value={item._id} key={item._id}>
                          {item._id}
                        </option>
                      );
                    })
                  )}
                </Input>
                <div className="chart">
                  {monthLabels.length && monthData.length ? (
                    <BarChart
                      labels={monthLabels}
                      title="Bar Chart of Sales By Month"
                      data={monthData}
                    />
                  ) : (
                    <h5>Please Select an Year</h5>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
}
