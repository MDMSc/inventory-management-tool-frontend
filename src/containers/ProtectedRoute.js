import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import ParentContext from "../reducer/Context";

export default function ProtectedRoute({ children }) {
  const context = useContext(ParentContext);
  if (
    !context.state.isLogged &&
    !context.state.isAdmin
  ) {
    return <Navigate to="/" replace />;
  }
  return children;
}
