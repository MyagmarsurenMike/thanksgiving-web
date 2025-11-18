'use client';

import React, { useState, useEffect } from 'react';
import { Button, Empty, Spin, Typography, Switch } from 'antd';
import { PlusOutlined, HeartOutlined } from '@ant-design/icons';
import StickyNotesBoard from '../../components/StickyNotesBoard'; // new component
import SubmitMessageModal from '../../components/SubmitMessageModal';

const { Title, Text } = Typography;

interface Message {
  _id: string;
  fromName: string;
  toName: string;
  message: string;
  emoji?: string;
  createdAt: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const AUTO_REFRESH_INTERVAL = 30000; // 30s

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesQuietly = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Auto refresh
  useEffect(() => {
    const id = setInterval(() => {
      fetchMessagesQuietly();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const handleSubmitSuccess = () => {
    fetchMessagesQuietly();
    setModalVisible(false);
  };

  return (
    <div className="min-h-screen thanksgiving-bg-main">
      {/* Hero */}
      <div className="thanksgiving-bg-hero border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <Title level={1} className="text-orange-800 mb-4 flex items-center justify-center gap-3">
            🦃 Талархлын баярын мэндчилгээ 🍂
          </Title>
          <Text className="text-orange-700 text-lg block mb-2">
            Энэ жилийн Талархлын баяраар юунд талархаж байгаагаа хуваалцан, бусдын мэндчилгээг уншаарай
          </Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-orange-700 text-lg">Мэндчилгээнүүдийг ачааллаж байна...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-orange-700">
                  <div className="text-xl font-medium mb-2">Одоогоор мэндчилгээ байхгүй байна</div>
                  <div className="text-lg">Та эхнийх нь болж талархлынхаа мэндчилгээг хуваалцаарай!</div>
                </div>
              }
            />
            <div className="mt-8">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-14 px-12 rounded-full thanksgiving-btn-primary text-lg"
              >
                Мэндчилгээ илгээх
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky notes board */}
            <StickyNotesBoard messages={messages} />

            {/* CTA */}
            <div className="text-center mt-12">
              <Text className="text-orange-700 text-xl font-medium mb-4 block">
                Танд талархах зүйл байна уу?
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-16 px-16 rounded-full thanksgiving-btn-primary text-lg font-medium"
              >
                Мэндчилгээ илгээх
              </Button>
            </div>
          </>
        )}
      </div>

      <footer className="thanksgiving-footer py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Text className="thanksgiving-footer-text">
            Бүх хүмүүст талархал, баяр жаргалаар дүүрэн Талархлын баяр болтугай! 🧡
          </Text>
        </div>
      </footer>

      <SubmitMessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
}
