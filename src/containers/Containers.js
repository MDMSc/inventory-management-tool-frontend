import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Inventory from "./Inventory";
import Dashboard from "./Dashboard";
import ProductAdd from "./ProductAdd";
import ProductEdit from "./ProductEdit";
import ProductView from "./ProductView";
import SoldInventory from "./SoldInventory";
import "../App.css";
import ProtectedRoute from "./ProtectedRoute";
import { Button } from "reactstrap";
import { IoLogOut } from "react-icons/io5";
import ParentContext from "../reducer/Context";
import { LOGOUT } from "../reducer/Action.type";
import AddUserForm from "../components/AddUserForm";
import SellProducts from "./SellProducts";

const Containers = () => {
  const context = useContext(ParentContext);

  return (
    <section>
      <h1 className="main-heading">Inventory Management Tool</h1>
      <Router>
        <ul className="left-nav">
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/sold-inventory">Sold Inventory</Link>
          </li>
          <li>
            <Link to="/sell-products">Sell Products</Link>
          </li>
          {context.state.isLogged && (
            <li>
              <Button
                id="logout"
                color="light"
                outline
                size="sm"
                onClick={() => {
                  context.dispatch({
                    type: LOGOUT,
                  });
                }}
              >
                <IoLogOut style={{ color: "white" }} />
              </Button>
            </li>
          )}
        </ul>

        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            path="/inventory"
            element={
              context.state.isLogged ? <Inventory /> : <Navigate to="/" />
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <ProductAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-product/:productID"
            element={
              context.state.isLogged ? <ProductView /> : <Navigate to="/" />
            }
          />
          <Route
            path="/edit-product/:productID"
            element={
              <ProtectedRoute>
                <ProductEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sold-inventory"
            element={
              <ProtectedRoute>
                <SoldInventory />
              </ProtectedRoute>
            }
          />
          <Route path="/add-user" element={<AddUserForm />} />

          <Route
            path="/sell-products"
            element={
              context.state.isLogged ? <SellProducts /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
    </section>
  );
};

export default Containers;
