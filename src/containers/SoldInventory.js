import React, { useContext } from "react";
import SoldProductTable from "../components/SoldProductTable";
import ParentContext from "../reducer/Context";

const SoldInventory = () => {
  const context = useContext(ParentContext);

  return (
    <div className="main-container">
      <h2>Sold Inventory</h2>
      {context.state.isAdmin ? (
        <SoldProductTable />
      ) : (
        <p style={{ color: "red", mt: "1rem" }}>
          Only admins can view the sold products section. Users can only check
          Inventory and Checkout sections
        </p>
      )}
    </div>
  );
};

export default SoldInventory;
