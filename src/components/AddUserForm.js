import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Alert, Spinner } from "reactstrap";
import * as Yup from "yup";
import "../css/form.css";
import { API } from "../Global";
import { useNavigate } from "react-router-dom";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid Email!!!").required("Required!!!"),
  phone: Yup.number().required("This field is requried"),
  type: Yup.string().required("Required"),
  password: Yup.string()
    .min(8, "Password must have atleast 8 characters")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("Required!!!"),
});

export default function AddUserForm() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 add-p-form">
          <h2>Add New User</h2>
          {success !== "" ? <Alert color="success">{success}</Alert> : ""}
          {error !== "" ? <Alert color="danger">{error}</Alert> : ""}
          <Formik
            initialValues={{
              username: "",
              email: "",
              phone: "",
              type: "",
              password: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              console.log(values);

              setLoading(true);
              fetch(`${API}/users/add-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              })
                .then(async (result) => {
                  const isJson = result.headers
                    .get("content-type")
                    ?.includes("application/json");
                  const data = isJson && (await result.json());

                  if (!result.ok) {
                    const error = (data && data.message) || result.statusText;
                    setError(error);
                    setLoading(false);
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                  } else {
                    setSuccess(data && data.message);
                    setLoading(false);
                    setTimeout(() => {
                      navigate(0);
                    }, 3000);
                  }
                })
                .catch((err) => {
                  setError(err.message);
                  setLoading(false);
                });
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <label>Username</label>
                <Field name="username" />
                {errors.username && touched.username ? (
                  <div className="error-msg">{errors.username}</div>
                ) : null}

                <label>Email</label>
                <Field name="email" type="email" />
                {errors.email && touched.email ? (
                  <div className="error-msg">{errors.email}</div>
                ) : null}

                <label>Phone Number</label>
                <Field
                  name="phone"
                  type="tel"
                  pattern="[1-9]{1}[0-9]{9}"
                  title="Phone number cannot start with 0 and must have 10 digits"
                />
                {errors.phone && touched.phone ? (
                  <div className="error-msg">{errors.phone}</div>
                ) : null}

                <label>Type</label>
                <Field
                  name="type"
                  as="select"
                  style={{ width: "98%", margin: "0 0.2rem" }}
                >
                  <option value="">Select user type</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Field>

                {errors.type && touched.type ? (
                  <div className="error-msg">{errors.type}</div>
                ) : null}

                <label>Password</label>
                <Field name="password" type="password" />
                {errors.password && touched.password ? (
                  <div className="error-msg">{errors.password}</div>
                ) : null}

                {loading ? (
                  <Spinner size="sm" style={{ margin: "1rem 0 0 2rem" }} />
                ) : (
                  <button type="submit" className="btn-submit">
                    Submit
                  </button>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
