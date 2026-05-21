import React from 'react';
import { useAuth } from '../context/auth-context';
import { Form, Input, message } from 'antd'
import { LongButton } from './styles';
import { useDispatch } from 'react-redux';
export const LoginScreen = () => {
  const { login } = useAuth()
  const dispatch=useDispatch()
  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await login(values);
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <Form onFinish={handleSubmit} >
      <Form.Item name={'username'} rules={[{required:true}]}>
        <Input placeholder={'用户名'} type="text" id="username" />
      </Form.Item >
      <Form.Item name={'password'} rules={[{required:true}]}>
        <Input placeholder={'密码'} type="password" id="password" />
      </Form.Item>
      <Form.Item><LongButton htmlType={'submit'} type="primary">登录</LongButton></Form.Item>
    </Form>
  );
};