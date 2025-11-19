'use client';

import React, { useState, useEffect } from 'react';
import { Button, Empty, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StickyNotesBoard from '../../components/StickyNotesBoard';
import SubmitMessageModal from '../../components/SubmitMessageModal';
import img from "../../logo.webp"

const { Text } = Typography;

interface Message {
  _id: string;
  fromName: string;
  toName: string;
  message: string;
  emoji?: string;
  createdAt: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const AUTO_REFRESH_INTERVAL = 30000; // 30 секунд

  // Fake messages for testing
  const fakeMessages: Message[] = [
    {
      _id: '1',
      fromName: 'Бат',
      toName: 'Багш',
      message: 'Энэ жилийн Талархлын баяраар олон сайхан зүйлд баярлаж байна! 🧡',
      emoji: '🦃',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      fromName: 'Мөнх',
      toName: 'Бүх хүн',
      message: 'Багш нарт болон найз нарт баярлалаа! 🌟',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '3',
      fromName: 'Сэргэлэн',
      toName: 'Бүх хүн',
      message: 'Өнөөдрийн баяр сайхан өнгөрөөсэй! 🍂',
      emoji: '🍂',
      createdAt: new Date().toISOString(),
    },
  ];

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Та API байгаа бол эндээс fetch хийж болно
      // const response = await fetch('/api/messages');
      // if (response.ok) {
      //   const data = await response.json();
      //   setMessages(data);
      // } else {
      //   console.error('Failed to fetch messages:', response.status);
      // }

      // Fake messages ашиглана
      setTimeout(() => {
        setMessages(fakeMessages);
        setLoading(false);
      }, 1000); // simulate network delay
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const fetchMessagesQuietly = async () => {
    try {
      // Реаль API байхгүй бол fake ашиглана
      setMessages(fakeMessages);
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

    {/* FIXED HEADER */}
    <div className="fixed top-0 left-0 w-full z-50 thanksgiving-bg-hero border-b border-orange-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center relative">

        {/* Logo Left */}
        <div className="flex-shrink-0 absolute left-4 top-1/2 -translate-y-1/2">
          <img
            src={img.src}
            alt="Шинэ монгол технологийн коллеж"
            className="hidden md:block w-20 md:w-24 object-contain"
          />
          <img
            src={img.src}
            alt="Mobile Logo"
            className="block md:hidden w-16 object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center w-full">
          <h1 className="text-orange-800 text-3xl sm:text-4xl md:text-5xl font-bold mb-1">
            🦃 Талархлын баярын мэндчилгээ 🍂
          </h1>
          <p className="text-orange-700 text-lg sm:text-xl md:text-2xl">
            Энэ жилийн Талархлын баяраар юунд талархаж байгаагаа хуваалцаарай
          </p>
        </div>

      </div>
    </div>

    {/* PAGE CONTENT */}
    <div className="pt-[160px] pb-20 max-w-7xl mx-auto px-4">

      {loading ? (
        <div className="text-center py-20">
          <Spin size="large" />
          <div className="mt-4 text-orange-700 text-lg">
            Мэндчилгээнүүдийг ачааллаж байна...
          </div>
        </div>
      ) : messages.length === 0 ? (

        <div className="text-center py-20">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-orange-700">
                <div className="text-xl font-medium mb-2">
                  Одоогоор мэндчилгээ байхгүй байна
                </div>
                <div className="text-lg">
                  Та эхнийх нь болж талархлынхаа мэндчилгээг хуваалцаарай!
                </div>
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
          <StickyNotesBoard messages={messages} />

          <div className="text-center mt-12">
            <p className="text-orange-700 text-xl font-medium mb-4">
              Танд талархах зүйл байна уу?
            </p>
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

    {/* FOOTER */}
    <footer className="thanksgiving-footer py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="thanksgiving-footer-text">
          Бүх хүмүүст талархал, баяр жаргалаар дүүрэн Талархлын баяр болтугай! 🧡
        </p>
        <p className="mt-2 text-sm text-orange-600">
          Сайтыг хийсэн: 8-р үеийн оюутнууд
        </p>
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