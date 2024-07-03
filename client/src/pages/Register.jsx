import {  Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
   const {registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading} = useContext(AuthContext)

  return (
    <Form onSubmit ={registerUser} >
      <Row style={{
        height: "100vh",
        justifyContent: "center",
        paddingTop: "20%"
      }}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Register</h2>
            <Form.Control type="text" placeholder="Name" onChange={(e)=> 
                updateRegisterInfo({...registerInfo,name: e.target.value})}/>
            <Form.Control type="password" placeholder="password" onChange={(e)=> 
                updateRegisterInfo({...registerInfo,password: e.target.value})}/>
            <Form.Control type="email" placeholder="email" onChange={(e)=> 
                updateRegisterInfo({...registerInfo,email: e.target.value})}/>
            <button variant= 'primary' type= 'submit'>
                {isRegisterLoading ? 'loading':'register'}</button>
            {registerError?.error && (
  <Alert variant="danger">
    <p>{registerError?.message}</p>
  </Alert>
)}

          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
