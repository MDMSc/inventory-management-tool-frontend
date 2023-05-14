import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Input,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import "../css/table.css";
import "../css/sellProduct.css";
import { API } from "../Global";
import SellTableContents from "./SellTableContents";

export default function SellProductTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [resultError, setResultError] = useState("");
  const [error, setError] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    payment_mode: "",
    amount: 0,
  });

  const toggle = () => setModal(!modal);

  useEffect(() => {
    setIsLoading(true);
    setSearchList([]);
    setResultError("");
    setError("");

    fetch(`${API}/assets/search?search=${search}`)
      .then(async (result) => {
        const data = await result.json();

        if (!result.ok) {
          const err = (data && data.message) || result.status;
          setResultError(err);
          setIsLoading(false);
          return Promise.reject(err);
        }
        setSearchList(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [search]);

  const handleAddItem = (item) => {
    setError("");

    const isItemPresent = tableList.filter((t) => t._id === item._id);
    if (isItemPresent.length) {
      return setError(
        `Product ${item.productID} is already present. Kindly increase the quantity value or remove it from the list.`
      );
    }

    item.soldQty = 0;
    item.amount = 0;
    setTableList([...tableList, item]);
    setSearch("");
  };

  const handlePaymentDone = () => {
    setError("");

    if (!paymentDetails.payment_mode || !paymentDetails.amount) {
      return setError("All fields are mandatory");
    }

    const totalAmount = tableList.reduce((acc, item) => {
      acc += item.amount;
      return acc;
    }, 0);

    if (totalAmount !== parseInt(paymentDetails.amount)) {
      return setError("Total Amount not matching");
    }

    const updatedTableList = tableList.map((item) => {
      return {
        productID: item.productID,
        amount: item.amount,
        soldQty: item.soldQty,
        type: item.type,
      };
    });

    setPaymentLoading(true);
    setError("");
    setSuccess("");
    fetch(`${API}/sell-assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTableList),
    })
      .then(async (result) => {
        const data = await result.json();

        if (!result.ok) {
          const err = (data && data.message) || result.status;
          setError(err);
          setPaymentLoading(false);
          return Promise.reject(err);
        }

        setSuccess(data.message);
        setTableList([]);
        setPaymentDetails({
          payment_mode: "",
          amount: 0,
        });
        setPaymentLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setPaymentLoading(false);
      });

    toggle();
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  };

  return (
    <>
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <div className="search-filter-area">
        <Row>
          <Col lg={4} md={4} sm={12}>
            <Input
              className="my-2 p-2"
              placeholder="Search by Product ID or Name ONLY..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              style={{
                width: "100%",
                position: "relative",
              }}
            />

            <Container
              className="bg-light border mx-2 p-2"
              fluid="sm"
              style={{
                position: "absolute",
                maxWidth: "50%",
                maxHeight: "15rem",
                borderRadius: "5px",
                display: search ? "flex" : "none",
                flexDirection: "column",
                zIndex: 1,
                overflow: "hidden",
                overflowY: "scroll",
                overflowX: "scroll",
              }}
            >
              {resultError ? (
                <p>{resultError}</p>
              ) : isLoading && !searchList.length ? (
                <p>Loading...</p>
              ) : (
                searchList.map((item) => (
                  <p
                    className="searchList_p"
                    key={item._id}
                    onClick={() => {
                      handleAddItem(item);
                    }}
                  >
                    {item.productID}-{item.name}-{item.gender}
                  </p>
                ))
              )}
            </Container>
          </Col>
        </Row>
      </div>

      <Table
        responsive
        striped
        style={{
          maxHeight: "40vh",
          overflowY: "scroll",
        }}
      >
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>NAME</th>
            <th>TYPE</th>
            <th>BRAND</th>
            <th>PRICE(in Rs.)</th>
            <th>QUANTITY</th>
            <th>AMOUNT(in Rs.)</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tableList.length ? (
            tableList.map((item) => {
              return (
                <SellTableContents
                  key={item._id}
                  item={item}
                  setError={setError}
                  tableList={tableList}
                  setTableList={setTableList}
                />
              );
            })
          ) : (
            <></>
          )}
          <tr>
            <td
              colSpan={6}
              style={{ textAlign: "right", paddingRight: "3rem" }}
            >
              <h4>Total</h4>
            </td>
            <td>
              <em>
                <b>
                  {tableList.reduce((acc, item) => {
                    acc += item.amount;
                    return acc;
                  }, 0)}
                </b>
              </em>
            </td>
            <td>
              <Button
                color="dark"
                style={{ padding: "0.5rem", marginBottom: "1rem" }}
                onClick={toggle}
                disabled={tableList.length ? false : true}
              >
                Checkout
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal isOpen={modal} toggle={toggle} backdrop fade centered scrollable>
        <ModalHeader toggle={toggle}>Checkout</ModalHeader>
        <ModalBody>
          <div style={{ width: "70%" }}>
            <label htmlFor="paymeny_mode">
              <h6>Payment Mode</h6>
            </label>
            <select
              name="payment_mode"
              value={paymentDetails.payment_mode}
              onChange={(e) => {
                setError("");
                setPaymentDetails({
                  ...paymentDetails,
                  payment_mode: e.target.value,
                });
              }}
              style={{ marginBottom: "1rem", width: "100%" }}
              required
            >
              <option value="">Select one payment mode</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit card</option>
              <option value="debit_card">Debit Card</option>
              <option value="upi">UPI (Phonepe, GPay, Paytm, etc.)</option>
              <option value="net_banking">Net Banking</option>
            </select>
            <br />

            <label htmlFor="amount">
              <h6>Total Amount</h6>
            </label>
            <input
              name="amount"
              type="number"
              style={{ margin: "0 0 1rem 0", width: "100%" }}
              onChange={(e) => {
                setError("");
                setPaymentDetails({
                  ...paymentDetails,
                  amount: e.target.value,
                });
              }}
              required
              min="0"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "+") {
                  return setError("No signs allowed");
                }
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          {paymentLoading ? (
            <Spinner style={{ margin: "1rem 2rem" }} />
          ) : (
            <Button
              color="dark"
              disabled={
                paymentDetails.payment_mode && paymentDetails.amount
                  ? false
                  : true
              }
              onClick={handlePaymentDone}
            >
              Payment Done
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
}
