'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, notification, Typography, Card, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Message {
  _id: string;
  fromName: string;
  toName: string;
  message: string;
  emoji?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        notification.error({
          message: 'Алдаа',
          description: 'Мэндчилгээнүүдийг ачааллаж чадсангүй',
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      notification.error({
        message: 'Сүлжээний алдаа',
        description: 'Мэндчилгээнүүдийг ачааллах боломжгүй',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateMessageStatus = async (messageId: string, status: 'approved' | 'rejected') => {
    setActionLoading(messageId);
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, status }),
      });

      if (response.ok) {
        const statusText = status === 'approved' ? 'зөвшөөрөгдлөө' : 'татгалзагдлаа';
        notification.success({
          message: 'Амжилттай',
          description: `Мэндчилгээ ${statusText}`,
        });
        fetchMessages();
      } else {
        const data = await response.json();
        const statusText = status === 'approved' ? 'зөвшөөрөх' : 'татгалзах';
        notification.error({
          message: 'Алдаа',
          description: data.error || `Мэндчилгээг ${statusText}д алдаа гарлаа`,
        });
      }
    } catch (error) {
      console.error('Error updating message:', error);
      notification.error({
        message: 'Сүлжээний алдаа',
        description: 'Мэндчилгээний төлөвийг шинэчлэх боломжгүй',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteMessage = async (messageId: string) => {
    setActionLoading(messageId);
    try {
      const response = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      if (response.ok) {
        notification.success({
          message: 'Амжилттай',
          description: 'Мэндчилгээ устгагдлаа',
        });
        fetchMessages();
      } else {
        const data = await response.json();
        notification.error({
          message: 'Алдаа',
          description: data.error || 'Мэндчилгээг устгахад алдаа гарлаа',
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      notification.error({
        message: 'Сүлжээний алдаа',
        description: 'Мэндчилгээг устгах боломжгүй',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Зөвшөөрөгдсөн';
      case 'rejected':
        return 'Татгалзагдсан';
      case 'pending':
        return 'Хүлээгдэж буй';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 'Дөрөвдүгээр сар',
      'Тавдугаар сар', 'Зургадугаар сар', 'Долдугаар сар', 'Наймдугаар сар',
      'Есдүгээр сар', 'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар сар'
    ];
    
    return `${date.getDate()}-р өдөр, ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const columns: ColumnsType<Message> = [
    {
      title: 'Хэнээс',
      dataIndex: 'fromName',
      key: 'fromName',
      width: 120,
      render: (fromName: string) => <strong className="text-orange-800">{fromName}</strong>,
    },
    {
      title: 'Хэнд',
      dataIndex: 'toName',
      key: 'toName',
      width: 120,
      render: (toName: string) => <strong className="text-orange-800">{toName}</strong>,
    },
    {
      title: 'Мэндчилгээ',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => (
        <div className="max-w-md">
          <p className="mb-0 line-clamp-3">{message}</p>
        </div>
      ),
    },
    {
      title: 'Сэтгэл хөдлөл',
      dataIndex: 'emoji',
      key: 'emoji',
      width: 80,
      align: 'center',
      render: (emoji: string) => <span className="text-2xl">{emoji || '-'}</span>,
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Огноо',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Үйлдэл',
      key: 'actions',
      width: 220,
      render: (_, record: Message) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                loading={actionLoading === record._id}
                onClick={() => updateMessageStatus(record._id, 'approved')}
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                Зөвшөөрөх
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                loading={actionLoading === record._id}
                onClick={() => updateMessageStatus(record._id, 'rejected')}
                className="border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
              >
                Татгалзах
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              size="small"
              icon={<CloseOutlined />}
              loading={actionLoading === record._id}
              onClick={() => updateMessageStatus(record._id, 'rejected')}
              className="border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              Татгалзах
            </Button>
          )}
          {record.status === 'rejected' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              loading={actionLoading === record._id}
              onClick={() => updateMessageStatus(record._id, 'approved')}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Зөвшөөрөх
            </Button>
          )}
          <Popconfirm
            title="Мэндчилгээг устгах"
            description="Та энэ мэндчилгээг бүрмөсөн устгахдаа итгэлтэй байна уу?"
            onConfirm={() => deleteMessage(record._id)}
            okText="Тийм"
            cancelText="Үгүй"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={actionLoading === record._id}
            >
              Устгах
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    approved: messages.filter(m => m.status === 'approved').length,
    rejected: messages.filter(m => m.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={1} className="text-orange-800! mb-4! flex items-center gap-3">
            🛠️ Админ хяналтын самбар
          </Title>
          <div className="flex justify-between items-center">
            <p className="text-orange-700 text-lg mb-0">
              Талархлын баярын мэндчилгээнүүдийг удирдан, шалгах
            </p>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMessages}
              loading={loading}
              className="border-orange-300 text-orange-700 hover:border-orange-400"
            >
              Шинэчлэх
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center border-orange-200">
            <Statistic title="Нийт мэндчилгээ" value={stats.total} valueStyle={{ color: '#ea580c' }} />
          </Card>
          <Card className="text-center border-yellow-200">
            <Statistic title="Хүлээгдэж буй" value={stats.pending} valueStyle={{ color: '#d97706' }} />
          </Card>
          <Card className="text-center border-green-200">
            <Statistic title="Зөвшөөрөгдсөн" value={stats.approved} valueStyle={{ color: '#16a34a' }} />
          </Card>
          <Card className="text-center border-red-200">
            <Statistic title="Татгалзагдсан" value={stats.rejected} valueStyle={{ color: '#dc2626' }} />
          </Card>
        </div>

        {/* Messages Table */}
        <Card className="border-orange-200">
          <Table
            columns={columns}
            dataSource={messages}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} мэндчилгээ`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
    </div>
  );
}