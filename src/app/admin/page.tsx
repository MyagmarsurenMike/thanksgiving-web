'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, notification, Typography, Card, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ProtectedRoute from '../../../components/ProtectedRoute';

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

function AdminDashboard() {
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
      '01', '02', '03', '04',
      '05', '06', '07', '08',
      '09', '10', '11', '12'
    ];
    
    return ` ${date.getFullYear()}-${months[date.getMonth()]}-${date.getDate()}`;
  };

  const columns: ColumnsType<Message> = [
    {
      title: 'Хэнээс',
      dataIndex: 'fromName',
      key: 'fromName',
      width: 120,
      render: (fromName: string) => <strong className="admin-table-name">{fromName}</strong>,
    },
    {
      title: 'Хэнд',
      dataIndex: 'toName',
      key: 'toName',
      width: 120,
      render: (toName: string) => <strong className="admin-table-name">{toName}</strong>,
    },
    {
      title: 'Мэндчилгээ',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => (
        <div className="admin-message-content">
          <p className="admin-message-text">{message}</p>
        </div>
      ),
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
      width: 150,
      render: (_, record: Message) => (
        <div className="admin-actions-column">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                loading={actionLoading === record._id}
                onClick={() => updateMessageStatus(record._id, 'approved')}
                className="admin-btn-approve"
              >
                Зөвшөөрөх
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                loading={actionLoading === record._id}
                onClick={() => updateMessageStatus(record._id, 'rejected')}
                className="admin-btn-reject"
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
              className="admin-btn-reject"
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
              className="admin-btn-approve"
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
        </div>
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
    <div className="admin-page-bg">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <Title level={1} className="admin-title">
            🛠️ Админ хяналтын самбар
          </Title>
          <div className="admin-header-content">
            <p className="admin-description">
              Талархлын баярын мэндчилгээнүүдийг удирдан, шалгах
            </p>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMessages}
              loading={loading}
              className="admin-refresh-btn"
            >
              Шинэчлэх
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="admin-stats-grid">
          <Card className="admin-stat-card total">
            <Statistic title="Нийт мэндчилгээ" value={stats.total} valueStyle={{ color: '#ea580c' }} />
          </Card>
          <Card className="admin-stat-card pending">
            <Statistic title="Хүлээгдэж буй" value={stats.pending} valueStyle={{ color: '#d97706' }} />
          </Card>
          <Card className="admin-stat-card approved">
            <Statistic title="Зөвшөөрөгдсөн" value={stats.approved} valueStyle={{ color: '#16a34a' }} />
          </Card>
          <Card className="admin-stat-card rejected">
            <Statistic title="Татгалзагдсан" value={stats.rejected} valueStyle={{ color: '#dc2626' }} />
          </Card>
        </div>

        {/* Messages Table */}
        <Card className="admin-table-card">
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

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}