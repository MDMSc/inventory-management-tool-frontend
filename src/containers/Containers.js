import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
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
import {IoLogOut} from 'react-icons/io5'
import ParentContext from "../reducer/Context";
import { LOGOUT } from "../reducer/Action.type";

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
            {
              context.state.isLogged && context.state.isAdmin && 
              <li>
                <Button id="logout" color="light" outline size="sm" onClick={() => {
                    context.dispatch({
                        type: LOGOUT
                    });
                }}>
                    <IoLogOut style={{color: "white"}}/>
                </Button>
              </li>
            }
          </ul>

          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
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
                <ProtectedRoute>
                  <ProductView />
                </ProtectedRoute>
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
          </Routes>
        </Router>
      </section>
  );
};

export default Containers;
