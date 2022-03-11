import { Magic } from 'magic-sdk';
import React, { useState } from 'react';
import Router from 'next/router';
import { Form, Input, Button } from 'antd';
import { useUser } from './lib/hooks';

export const Login = () => {
  useUser({ redirectTo: '/dashboard', redirectIfFound: true });
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(values) {
    if (errorMsg) setErrorMsg('');
    const body = {
      email: values.email,
    };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGICLINK_KEY || '');
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        Router.push('/dashboard');
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error);
      // @ts-ignore
      setErrorMsg(error.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-area">
        <div className="login-container">
          <img src="/favicon-96x96.png" className="logo" alt="logo" />
          <h1>Welcome back</h1>
          <Form
            className="login-form"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Log in / Sign up</Button>
            </Form.Item>
          </Form>
          {errorMsg && <span className="error-msg">{errorMsg}</span>}
          <div className="bottom-container">
            <a
              href="https://magic.link/"
              target="_blank"
              rel="noreferer noreferrer"
            >
              <span className="text">Secured by</span>
              <img src="/icons/magiclink.svg" alt="magiclink" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
