import React, { useContext } from "react";
import AddForm from "../components/AddForm";
import ParentContext from "../reducer/Context";

export default function ProductAdd() {
  const context = useContext(ParentContext);

  return (
    <div className="main-container">
      {context.state.isAdmin ? (
        <AddForm />
      ) : (
        <p style={{ color: "red", mt: "2rem" }}>
          Only admins can add products. Users can only check Inventory and
          Checkout sections
        </p>
      )}
    </div>
  );
}
