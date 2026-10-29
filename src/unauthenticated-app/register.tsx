import React from 'react';
import { useAuth } from '../context/auth-context';
import { Form, Input, message } from 'antd'
import { LongButton } from './styles';

export const RegisterScreen = () => {
  const { register } = useAuth()

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await register(values);
    } catch (error) {
      message.error('注册失败，请稍后重试');
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
      <Form.Item><LongButton htmlType={'submit'} type="primary">注册</LongButton></Form.Item>
    </Form>
  );
};