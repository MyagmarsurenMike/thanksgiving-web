'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, Spin, Typography } from 'antd';
import { PlusOutlined, HeartOutlined } from '@ant-design/icons';
import SubmitMessageModal from '../../components/SubmitMessageModal';

const { Title, Text } = Typography;

interface Message {
  _id: string;
  name: string;
  message: string;
  emoji?: string;
  createdAt: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmitSuccess = () => {
    // Optionally refresh messages, though new ones won't show until approved
    fetchMessages();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <Title level={1} className="!text-orange-800 !mb-2 flex items-center justify-center gap-3">
              🦃 Thanksgiving Messages 🍂
            </Title>
            <Text className="text-orange-700 text-lg">
              Share what you're grateful for this Thanksgiving season
            </Text>
          </div>
          
          <div className="mt-6 text-center">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              className="h-12 px-8 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Share Your Message
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-orange-700">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-orange-700">
                  <div className="text-lg font-medium mb-2">No messages yet</div>
                  <div>Be the first to share what you're grateful for!</div>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((message) => (
              <Card
                key={message._id}
                className="h-full shadow-md hover:shadow-lg transition-all duration-300 border-orange-200 hover:border-orange-300"
                style={{
                  background: 'linear-gradient(135deg, #fefefe 0%, #fdf7f0 100%)',
                }}
                bodyStyle={{ 
                  padding: '20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HeartOutlined className="text-orange-500" />
                      <Text strong className="text-orange-800">
                        {message.name}
                      </Text>
                    </div>
                    {message.emoji && (
                      <span className="text-2xl">{message.emoji}</span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <Text className="text-gray-700 leading-relaxed text-base">
                      "{message.message}"
                    </Text>
                  </div>
                </div>
                
                <div className="border-t border-orange-100 pt-3 mt-auto">
                  <Text type="secondary" className="text-sm">
                    {formatDate(message.createdAt)}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-orange-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Text className="text-orange-100">
            Wishing everyone a wonderful Thanksgiving filled with gratitude and joy! 🧡
          </Text>
        </div>
      </footer>

      {/* Submit Message Modal */}
      <SubmitMessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
}
