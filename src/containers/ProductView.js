import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { API } from "../Global";

export default function ProductView() {
  const { productID } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    getProducts();

  }, [isLoading, productID]);

  return (
    <div className="main-container">

      {error !== "" ? (
        <h3 className=".error-msg">{error}</h3>
      ) : isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <ProductForm isreadOnly={true} product={product} />
      )}

    </div>
  );
}
