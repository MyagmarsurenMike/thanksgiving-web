'use client';

import React, { useState, useEffect } from 'react';
import { Button, Empty, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StickyNotesBoard from '../../components/StickyNotesBoard';
import SubmitMessageModal from '../../components/SubmitMessageModal';
import img from "../../public/LOGO nmk.png";

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
  const AUTO_REFRESH_INTERVAL = 100000; // 1 minute

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      setMessages(await response.json());
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchMessagesQuietly = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      setMessages(await response.json());
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };

  // Auto refresh
  useEffect(() => {
    fetchMessages();
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
        <div className="max-w-full mx-auto px-4 py-3 sm:py-4 md:py-6 flex items-center justify-between">
          {/* Logo Left */}
          <div className="shrink-0">
            <img
              src={img.src}
              alt="Logo"
              className="h-20 sm:h-20 md:h-20 object-contain"
            />
          </div>

          {/* Title */}
          <div className="flex-1 text-center mx-4">
            <h1 className="text-orange-800 text-lg sm:text-2xl md:text-4xl font-bold leading-tight">
              ❤️ Талархлын баяр 2025 ❤️
            </h1>
            <p className="text-blue-500 text-xs sm:text-sm md:text-lg">
              VIII үеийн оюутнууд эрдмийн замд чиглүүлсэн эрхэм багш нартаа талархлын мэндчилгээ дэвшүүлж байна.
            </p>
          </div>

          {/* Button Right */}
          <div className="shrink-0">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              className="h-10 sm:h-12 md:h-14 px-3 sm:px-6 rounded-full flex items-center"
            >
              <span className="hidden sm:inline"></span>
            </Button>
          </div>

        </div>
      </div>
      {/* PAGE CONTENT */}
      <div className="pt-40 pb-20 max-w-7xl mx-auto px-4">

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
                Та ч бас талархлын мэндчилгээгээ илгээгээрэй.
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
            Талархал илгээсэнд баярлалаа. 🧡
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
