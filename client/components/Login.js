import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, Redirect, useHistory } from 'react-router-dom';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const login = () => {
    fetch('/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        console.log(res.status)
        if (res.status === 200) {
          props.auth(username); // set app state to authed
          history.push('/'); // redirect to main app
        }
        else console.log(res.json());
      });
  };

  return (
    <div className="form">
    <Form
      name="normal_login"
      className="login-form"
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input onChange={(e) => setUsername(e.target.value)} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          onChange={(e) => setPassword(e.target.value)} 
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button onClick={login} type="primary" className="login-form-button">
          Log in
        </Button>
        <Link to="/register">Register</Link>
        <Link to="/">Or continue as a guest</Link>
      </Form.Item>
    </Form>
  </div>
  );
};

export default Login;