'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, notification, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface LoginForm {
  name: string;
  password: string;
}

export default function AdminLoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          password: values.password,
        }),
      });

      if (response.ok) {
        notification.success({
          message: 'Амжилттай нэвтэрлээ',
          description: 'Админ самбар руу шилжиж байна...',
        });
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Нэвтрэх алдаа',
          description: errorData.error || 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      notification.error({
        message: 'Сүлжээний алдаа',
        description: 'Сервертэй холбогдох боломжгүй байна',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="w-full max-w-md px-4">
        <Card 
          className="shadow-lg border-orange-200"
          style={{ borderRadius: '16px' }}
        >
          <div className="text-center mb-6">
            <Title level={2} className="text-orange-800! mb-2!">
              🦃 Админ нэвтрэх
            </Title>
            <Text className="text-orange-600">
              Талархлын баярын мэндчилгээний систем
            </Text>
          </div>

          <Form
            form={form}
            name="adminLogin"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              label="Хэрэглэгчийн нэр"
              rules={[
                {
                  required: true,
                  message: 'Хэрэглэгчийн нэрээ оруулна уу!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-orange-400" />}
                placeholder="Хэрэглэгчийн нэр"
                className="border-orange-200 focus:border-orange-400"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Нууц үг"
              rules={[
                {
                  required: true,
                  message: 'Нууц үгээ оруулна уу!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-orange-400" />}
                placeholder="Нууц үг"
                className="border-orange-200 focus:border-orange-400"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 border-orange-600 h-12"
                style={{ borderRadius: '8px' }}
              >
                {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-orange-500 text-sm">
              🍂 Талархлын баярын мэндчилгээг хамтдаа бүтээе
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}