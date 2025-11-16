'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, Spin, Typography, Carousel, Switch } from 'antd';
import { PlusOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
  const [isCarouselMode, setIsCarouselMode] = useState(true);
  const carouselRef = React.useRef<any>(null);

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
    fetchMessages();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: false,
    effect: 'slide',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <Title level={1} className="!text-orange-800 !mb-4 flex items-center justify-center gap-3">
            🦃 Welcome to Our Thanksgiving Community 🍂
          </Title>
          <Text className="text-orange-700 text-lg block mb-6">
            Share what you're grateful for this Thanksgiving season and read heartfelt messages from others
          </Text>
          
          {messages.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              <Text className="text-orange-700 font-medium">Grid View</Text>
              <Switch
                checked={isCarouselMode}
                onChange={setIsCarouselMode}
                className="bg-orange-200"
              />
              <Text className="text-orange-700 font-medium">Carousel View</Text>
            </div>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-orange-700 text-lg">Loading heartfelt messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-orange-700">
                  <div className="text-xl font-medium mb-2">No messages yet</div>
                  <div className="text-lg">Be the first to share what you're grateful for!</div>
                </div>
              }
            />
            {/* Share Button for Empty State */}
            <div className="mt-8">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-14 px-12 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Share Your Gratitude
              </Button>
            </div>
          </div>
        ) : isCarouselMode ? (
          /* Carousel Mode - Much Wider and Bigger */
          <div className="relative">
            <div className="mb-12 text-center">
              <Title level={1} className="!text-orange-800 !mb-4 !text-5xl">
                Messages of Gratitude
              </Title>
              <Text className="text-orange-600 text-2xl">Heartfelt messages from our community</Text>
            </div>

            <Carousel
              ref={carouselRef}
              {...carouselSettings}
              className="[&_.ant-carousel_.slick-dots]:bottom-[-50px] [&_.ant-carousel_.slick-dots_li_button]:w-3 [&_.ant-carousel_.slick-dots_li_button]:h-3 [&_.ant-carousel_.slick-dots_li_button]:rounded-full [&_.ant-carousel_.slick-dots_li_button]:bg-orange-200 [&_.ant-carousel_.slick-dots_li_button]:border-2 [&_.ant-carousel_.slick-dots_li_button]:border-orange-300 [&_.ant-carousel_.slick-dots_li_button]:opacity-60 [&_.ant-carousel_.slick-dots_li_button]:transition-all [&_.ant-carousel_.slick-dots_li_button]:duration-300 [&_.ant-carousel_.slick-dots_li.slick-active_button]:bg-orange-600 [&_.ant-carousel_.slick-dots_li.slick-active_button]:opacity-100 [&_.ant-carousel_.slick-dots_li.slick-active_button]:scale-110 [&_.ant-carousel_.slick-slide]:p-0 [&_.ant-carousel_.slick-slide]:transition-all [&_.ant-carousel_.slick-slide]:duration-500 [&_.ant-carousel_.slick-slide]:ease-in-out [&_.ant-carousel_.slick-slide>div]:flex [&_.ant-carousel_.slick-slide>div]:justify-center [&_.ant-carousel_.slick-slide>div]:items-center [&_.ant-carousel_.slick-slide>div]:w-full [&_.ant-carousel_.slick-track]:flex [&_.ant-carousel_.slick-track]:items-center [&_.ant-carousel_.slick-list]:p-0"
            >
              {messages.map((message) => (
                <div key={message._id}>
                  <div className="w-full max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 xl:px-6">
                    <Card
                      className="shadow-2xl border-0 overflow-hidden transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-3xl"
                      style={{
                        background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)',
                        minHeight: '500px',
                      }}
                      bodyStyle={{ 
                        padding: '100px 80px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '500px'
                      }}
                    >
                      {/* Emoji */}
                      {message.emoji && (
                        <div className="mb-10">
                          <span className="text-9xl">{message.emoji}</span>
                        </div>
                      )}
                      
                      {/* Message */}
                      <div className="mb-10">
                        <Text className="text-gray-800 text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-relaxed font-medium italic">
                          "{message.message}"
                        </Text>
                      </div>
                      
                      {/* Author and Date */}
                      <div className="flex items-center justify-center gap-6 text-orange-800">
                        <HeartOutlined className="text-orange-600 text-3xl" />
                        <Text strong className="text-2xl md:text-3xl">
                          {message.name}
                        </Text>
                        <Text className="text-orange-600 text-xl">
                          • {formatDate(message.createdAt)}
                        </Text>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </Carousel>

            {/* Custom Navigation Buttons */}
            <div className="flex justify-center gap-8 mt-16">
              <Button
                shape="circle"
                size="large"
                icon={<LeftOutlined />}
                onClick={() => carouselRef.current?.prev()}
                className="bg-white/80 border-orange-300 hover:bg-orange-50 hover:border-orange-400 shadow-lg w-20 h-20 text-2xl"
              />
              <Button
                shape="circle"
                size="large"
                icon={<RightOutlined />}
                onClick={() => carouselRef.current?.next()}
                className="bg-white/80 border-orange-300 hover:bg-orange-50 hover:border-orange-400 shadow-lg w-20 h-20 text-2xl"
              />
            </div>

            {/* Share Your Message Button - Below Carousel */}
            <div className="text-center mt-20">
              <div className="mb-8">
                <Text className="text-orange-700 text-2xl font-medium">
                  Have something you're grateful for?
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-20 px-20 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-2xl"
              >
                Share Your Gratitude
              </Button>
            </div>
          </div>
        ) : (
          /* Grid Mode - Original layout */
          <div>
            <div className="mb-8 text-center">
              <Title level={2} className="!text-orange-800 !mb-2">
                Messages of Gratitude
              </Title>
              <Text className="text-orange-600 text-lg">All heartfelt messages from our community</Text>
            </div>
            
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

            {/* Share Your Message Button - Below Grid */}
            <div className="text-center mt-12">
              <div className="mb-4">
                <Text className="text-orange-700 text-lg font-medium">
                  Have something you're grateful for?
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-14 px-12 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Share Your Gratitude
              </Button>
            </div>
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
