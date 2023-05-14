import React, { useContext } from "react";
import DashboardChart from "../components/DashboardChart";
import ParentContext from "../reducer/Context";

const Dashboard = () => {
  const context = useContext(ParentContext);

  return (
    <div className="main-container">
      <h1>Dashboard</h1>
      {
        context.state.isAdmin ? <DashboardChart /> : (
          <p style={{ color: "red", mt: "2rem" }}>Only admins can view the dashboard. Users can only check Inventory and Checkout sections</p>
        )
      }
    </div>
  );
};

export default Dashboard;
