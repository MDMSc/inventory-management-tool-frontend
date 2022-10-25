import React, { useState } from 'react';
import {Alert} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import '../css/form.css'
import { useNavigate } from 'react-router-dom';
import { API } from '../Global';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
    type: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
    brand: Yup.string()
    .required('Required'),
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

export default function AddForm() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  return (
  <div className='add-p-form'>
    <h2>Add New Product</h2>
    {success !== "" ? <Alert color="success">{success}</Alert> : ""}
      {error !== "" ? <Alert color="danger">{error}</Alert> : ""}
    <Formik
      initialValues={{
        name: '',
        type: '',
        brand: '',
        gender:'',
        size:'',
        description:'',
        price: 0,
        inStockQty: 0
      }}
      validationSchema={SignupSchema}
      onSubmit={values => {
        values.price = parseInt(values.price);
        values.inStockQty = parseInt(values.inStockQty);
        
        fetch(`${API}/assets/add-asset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })
        .then(async result => {
            const isJson = result.headers.get('content-type')?.includes('application/json');
            const data = isJson && await result.json();

            if (!result.ok) {
                const error = (data && data.message) || result.status;
                setError(error)
                return Promise.reject(error);
            }
            setSuccess(data.message)
        })
        .catch(err => {
          setError(err.message);
        });

        setTimeout(() => {
          navigate("/inventory");
        }, 3000);

      }}
    >
      {({ errors, touched }) => (
        <Form>
          <label>Name</label>
          <Field name="name" />
          {errors.name && touched.name ? (
            <div className='error-msg'>{errors.name}</div>
          ) : null}
          <label>Type</label>
          <Field name="type" />
          {errors.type && touched.type ? (
            <div className='error-msg'>{errors.type}</div>
          ) : null}
          <label>Brand</label>
          <Field name="brand" />
          {errors.brand && touched.brand ? (
            <div className='error-msg'>{errors.brand}</div> 
          ): null}
          <label>Gender</label>
          <Field name="gender" />
          {errors.gender && touched.gender ? (
            <div className='error-msg'>{errors.gender}</div>
          ) : null}
          <label>Size</label>
          <Field name="size" />
          {errors.size && touched.size ? (
            <div className='error-msg'>{errors.size}</div>
          ) : null}
          <label>Description</label>
          <Field name="description" />
          {errors.description && touched.description ? (
            <div className='error-msg'>{errors.description}</div>
          ) : null}
          <label>Price</label>
          <Field name="price" />
          {errors.price && touched.price ? (
            <div className='error-msg'>{errors.price}</div>
          ) : null}
          <label>Stock Quantity</label>
          <Field name="inStockQty" />
          {errors.inStockQty && touched.inStockQty ? (
            <div className='error-msg'>{errors.inStockQty}</div>
          ) : null}
          <button type="submit" className='btn-submit'>Submit</button>
        </Form>
      )}
    </Formik>
  </div>
)};
