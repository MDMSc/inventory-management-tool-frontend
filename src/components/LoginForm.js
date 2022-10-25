import React, { useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import '../css/login.css'
import { API } from '../Global';
import { Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import ParentContext from '../reducer/Context';
import { IS_ADMIN, IS_LOGGED } from '../reducer/Action.type';
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm = () => {
  const context = useContext(ParentContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
  <div className='container'>
    {error !== "" ? <Alert color="danger">{error}</Alert> : ""}
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={values => {

        fetch(`${API}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })
        .then(async result => {
            const isJson = result.headers.get('content-type')?.includes('application/json');
            const data = isJson && await result.json();
            
            if (!result.ok) {
                const error = (data && data.message) || result.statusText;
                setError(error);
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
            }else{
              context.dispatch({
                type: IS_LOGGED
              });
              if(data){
                if(data.data.length){
                  if(data.data[0].type === "admin"){
                    context.dispatch({
                      type: IS_ADMIN
                    });
                    navigate('/inventory');
                  }
                }
              }
            }

        })
        .catch(err => {
          setError(err.message);
        });
      }}
    >
      {({ errors, touched }) => (
        <div className='row'>
        <Form className='col-xs-12 col-sm-12 col-md-12 col-lg-4 log-in'>
          <h2>Login</h2>
          <label>Username</label>
          <Field name="username" />
          {errors.email && touched.email && <div className='error-msg'>{errors.email}</div>}
          <label>Password</label>
          <Field name="password" type="password"/>
          {errors.username && touched.username && <div className='error-msg'>{errors.username}</div>}

          <button type="submit" className='btn-submit'>Submit</button>
        </Form>
        </div>
      )}
    </Formik>
  </div>
)};

export default LoginForm;