import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Alert } from "reactstrap";
import * as Yup from "yup";
import "../css/form.css";
import { API } from "../Global";
import { useNavigate } from "react-router-dom";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  type: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  brand: Yup.string().required("Required"),
  gender: Yup.string().oneOf(["male", "female", "unisex"]).required("Required"),
  size: Yup.string()
    .oneOf(["XS", "S", "M", "L", "XL", "XXL", "XXXL"])
    .required("Required"),
  description: Yup.string().required("Required"),
  price: Yup.number("Enter only numeric values")
    .positive("Please enter positive value")
    .required("Required"),
  inStockQty: Yup.number("Enter only numeric values")
    .positive("Please enter positive value")
    .required("Required")
});

export default function ProductForm({ isreadOnly, product }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    productID,
    name,
    type,
    brand,
    gender,
    size,
    description,
    price,
    inStockQty,
  } = product;

  return (
    <div className="add-p-form">
      {
        isreadOnly ? <h2>Product Details</h2> : <h2>Edit Product Details</h2>
      }
      {success !== "" ? <Alert color="success">{success}</Alert> : ""}
      {error !== "" ? <Alert color="danger">{error}</Alert> : ""}
      <Formik
        initialValues={{
          productID: productID,
          name: name,
          type: type,
          brand: brand,
          gender: gender,
          size: size,
          description: description,
          price: price,
          inStockQty: inStockQty,
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          values.price = parseInt(values.price);
        values.inStockQty = parseInt(values.inStockQty);

          const result = await fetch(
            `${API}/assets/update-asset/${productID}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          const data = await result.json();

          try {
            if (result.ok === true) {
              if (result.status === 200) {
                setSuccess(data.message);
              } else {
                setError(data.message);
              }
            } else {
              setError("Product " + result.statusText);
            }
          } catch (err) {
            setError(err.message);
          }

          setTimeout(() => {
            navigate("/inventory");
          }, 3000);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <label>Product ID</label>
            <Field
              name="productID"
              readOnly
              style={{ backgroundColor: "transparent", border: "none" }}
            />

            <label>Name</label>
            <Field name="name" readOnly={isreadOnly} />
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
            <label>Type</label>
            <Field name="type" readOnly={isreadOnly} />
            {errors.type && touched.type ? (
              <div className="error-msg">{errors.type}</div>
            ) : null}
            <label>Brand</label>
            <Field name="brand" readOnly={isreadOnly} />
            {errors.brand && touched.brand ? (
              <div className="error-msg">{errors.brand}</div>
            ) : null}
            <label>Gender</label>
            <Field name="gender" readOnly={isreadOnly} />
            {errors.gender && touched.gender ? (
              <div className="error-msg">{errors.gender}</div>
            ) : null}
            <label>Size</label>
            <Field name="size" readOnly={isreadOnly} />
            {errors.size && touched.size ? (
              <div className="error-msg">{errors.size}</div>
            ) : null}
            <label>Description</label>
            <Field name="description" readOnly={isreadOnly} />
            {errors.description && touched.description ? (
              <div className="error-msg">{errors.description}</div>
            ) : null}
            <label>Price</label>
            <Field name="price" readOnly={isreadOnly} />
            {errors.price && touched.price ? (
              <div className="error-msg">{errors.price}</div>
            ) : null}
            <label>Stock Quantity</label>
            <Field name="inStockQty" readOnly={isreadOnly} />
            {errors.inStockQty && touched.inStockQty ? (
              <div className="error-msg">{errors.inStockQty}</div>
            ) : null}
            {isreadOnly ? (
              ""
            ) : (
              <button type="submit" className="btn-submit">
                Submit
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

