'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, notification, Typography, Card, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Message {
  _id: string;
  name: string;
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
          message: 'Error',
          description: 'Failed to fetch messages',
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      notification.error({
        message: 'Network Error',
        description: 'Unable to fetch messages',
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
        notification.success({
          message: 'Success',
          description: `Message ${status} successfully`,
        });
        fetchMessages();
      } else {
        const data = await response.json();
        notification.error({
          message: 'Error',
          description: data.error || `Failed to ${status} message`,
        });
      }
    } catch (error) {
      console.error('Error updating message:', error);
      notification.error({
        message: 'Network Error',
        description: 'Unable to update message status',
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
          message: 'Success',
          description: 'Message deleted successfully',
        });
        fetchMessages();
      } else {
        const data = await response.json();
        notification.error({
          message: 'Error',
          description: data.error || 'Failed to delete message',
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      notification.error({
        message: 'Network Error',
        description: 'Unable to delete message',
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

  const columns: ColumnsType<Message> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (name: string) => <strong className="text-orange-800">{name}</strong>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => (
        <div className="max-w-md">
          <p className="mb-0 line-clamp-3">{message}</p>
        </div>
      ),
    },
    {
      title: 'Emoji',
      dataIndex: 'emoji',
      key: 'emoji',
      width: 80,
      align: 'center',
      render: (emoji: string) => <span className="text-2xl">{emoji || '-'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
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
                Approve
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                loading={actionLoading === record._id}
                onClick={() => updateMessageStatus(record._id, 'rejected')}
                className="border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
              >
                Reject
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
              Reject
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
              Approve
            </Button>
          )}
          <Popconfirm
            title="Delete Message"
            description="Are you sure you want to permanently delete this message?"
            onConfirm={() => deleteMessage(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={actionLoading === record._id}
            >
              Delete
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={1} className="!text-orange-800 !mb-4 flex items-center gap-3">
            🛠️ Admin Dashboard
          </Title>
          <div className="flex justify-between items-center">
            <p className="text-orange-700 text-lg mb-0">
              Manage and moderate Thanksgiving messages
            </p>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMessages}
              loading={loading}
              className="border-orange-300 text-orange-700 hover:border-orange-400"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center border-orange-200">
            <Statistic title="Total Messages" value={stats.total} valueStyle={{ color: '#ea580c' }} />
          </Card>
          <Card className="text-center border-yellow-200">
            <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#d97706' }} />
          </Card>
          <Card className="text-center border-green-200">
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#16a34a' }} />
          </Card>
          <Card className="text-center border-red-200">
            <Statistic title="Rejected" value={stats.rejected} valueStyle={{ color: '#dc2626' }} />
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} messages`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </div>
  );
}