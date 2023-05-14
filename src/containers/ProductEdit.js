import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { API } from "../Global";
import ParentContext from "../reducer/Context";

export default function ProductEdit() {
  const { productID } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const context = useContext(ParentContext);

  async function getProducts() {
    const result = await fetch(`${API}/assets/get-asset/${productID}`, {
      method: "GET",
    });
    const data = await result.json();
    if (isLoading && Object.keys(data).length) {
      setIsLoading(false);
      setProduct({ ...data });
    }

    try {
      if (result.ok === true) {
        if (result.status === 200) {
          return;
        } else {
          setError(result.statusText);
          setIsLoading(true);
        }
      } else {
        setError(`Product ${productID}` + result.statusText);
        setIsLoading(true);
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(true);
    }
  }

  useEffect(() => {
    getProducts();
  }, [isLoading, productID]);

  return (
    <div className="main-container">
      {context.state.isAdmin ? (
        error !== "" ? (
          <h3 className=".error-msg">{error}</h3>
        ) : isLoading ? (
          <h3>Loading...</h3>
        ) : (
          <ProductForm isreadOnly={false} product={product} />
        )
      ) : (
        <p style={{ color: "red", mt: "2rem" }}>
          Only admins can edit products. Users can only check Inventory and
          Checkout sections
        </p>
      )}
    </div>
  );
}
