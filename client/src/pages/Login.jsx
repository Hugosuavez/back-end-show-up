import { Form, Row, Col, Stack } from "react-bootstrap";

const Login = () => {
  return (
    <Form>
      <Row style={{
        height: "100vh",
        justifyContent: "center",
        paddingTop: "20%"
      }}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Register</h2>
            <Form.Control type="text" placeholder="Name" />
            <Form.Control type="password" placeholder="password" />
            <Form.Control type="email" placeholder="email" />
            <button variant= 'primary' type= 'submit'>Login</button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
