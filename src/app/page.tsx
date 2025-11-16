'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, Spin, Typography, Carousel, Switch, Pagination } from 'antd';
import { PlusOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
  const [isCarouselMode, setIsCarouselMode] = useState(true);
  const [currentGridIndex, setCurrentGridIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const carouselRef = React.useRef<any>(null);

  const MESSAGES_PER_GRID = 6; // 2 rows × 3 columns
  const GRID_ROTATION_INTERVAL = 5000; // 5 seconds
  const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds - refresh data

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

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, []);

  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchMessagesQuietly();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, []);

  // Auto-rotate grid messages
  useEffect(() => {
    if (!isCarouselMode && messages.length > MESSAGES_PER_GRID) {
      const interval = setInterval(() => {
        setFadeClass('opacity-0');
        setTimeout(() => {
          setCurrentGridIndex((prevIndex) => {
            const totalGrids = Math.ceil(messages.length / MESSAGES_PER_GRID);
            return (prevIndex + 1) % totalGrids;
          });
          setFadeClass('opacity-100');
        }, 300);
      }, GRID_ROTATION_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isCarouselMode, messages.length]);

  const handleSubmitSuccess = () => {
    fetchMessagesQuietly(); // Refresh immediately after new message submission
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 'Дөрөвдүгээр сар',
      'Тавдугаар сар', 'Зургадугаар сар', 'Долдугаар сар', 'Наймдугаар сар',
      'Есдүгээр сар', 'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар сар'
    ];
    
    return `${date.getFullYear()}-оны ${months[date.getMonth()]}ын ${date.getDate()}`;
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
    effect: 'slide' as any,
  };

  const getCurrentGridMessages = () => {
    const startIndex = currentGridIndex * MESSAGES_PER_GRID;
    return messages.slice(startIndex, startIndex + MESSAGES_PER_GRID);
  };

  const getTotalGrids = () => {
    return Math.ceil(messages.length / MESSAGES_PER_GRID);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-100 to-amber-100 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <Title level={1} className="text-orange-800! mb-4! flex items-center justify-center gap-3">
            🦃 Талархлын баярын мэндчилгээний вэбсайт 🍂
          </Title>
          <Text className="text-orange-700 text-lg block mb-6">
            Энэ жилийн Талархлын баяраар юунд талархаж байгаагаа хуваалцан, бусдын сэтгэл хөдөлгөм мэндчилгээг уншаарай
          </Text>
          
          {messages.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              <Text className="text-orange-700 font-medium">Жагсаалт харах</Text>
              <Switch
                checked={isCarouselMode}
                onChange={setIsCarouselMode}
                className="bg-orange-200"
              />
              <Text className="text-orange-700 font-medium">Слайд харах</Text>
            </div>
          )}
        </div>
      </div>

      {/* Messages Section */}
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
                className="h-14 px-12 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Мэндчилгээ илгээх
              </Button>
            </div>
          </div>
        ) : isCarouselMode ? (
          /* Carousel Mode */
          <div className="relative">
            <div className="mb-12 text-center">
              <Title level={1} className="text-orange-800! mb-4! text-5xl!">
                Талархлын мэндчилгээнүүд
              </Title>
            </div>

            <Carousel
              ref={carouselRef}
              {...carouselSettings}
              className="[&_.ant-carousel_.slick-dots]:bottom-[-50px] [&_.ant-carousel_.slick-dots_li_button]:w-3 [&_.ant-carousel_.slick-dots_li_button]:h-3 [&_.ant-carousel_.slick-dots_li_button]:rounded-full [&_.ant-carousel_.slick-dots_li_button]:bg-orange-200 [&_.ant-carousel_.slick-dots_li_button]:border-2 [&_.ant-carousel_.slick-dots_li_button]:border-orange-300 [&_.ant-carousel_.slick-dots_li_button]:opacity-60 [&_.ant-carousel_.slick-dots_li_button]:transition-all [&_.ant-carousel_.slick-dots_li_button]:duration-300 [&_.ant-carousel_.slick-dots_li.slick-active_button]:bg-orange-600 [&_.ant-carousel_.slick-dots_li.slick-active_button]:opacity-100 [&_.ant-carousel_.slick-dots_li.slick-active_button]:scale-110"
            >
              {messages.map((message) => (
                <div key={message._id}>
                  <div className="w-full max-w-[1200px] xl:max-w-[1400px] mx-auto px-5 xl:px-6">
                    <Card
                      className="shadow-2xl border-0 overflow-hidden transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-3xl"
                      style={{
                        background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)',
                        minHeight: '600px',
                      }}
                      bodyStyle={{ 
                        padding: '80px 60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '600px'
                      }}
                    >
                      {/* From Info at Top Left */}
                      <div className="mb-6 text-left">
                        <Text strong className="text-orange-700 text-lg md:text-xl">
                          Хэнээс: {message.fromName}
                        </Text>
                      </div>

                      {/* Emoji */}
                      {message.emoji && (
                        <div className="mb-6 text-center">
                          <span className="text-6xl md:text-7xl lg:text-8xl">{message.emoji}</span>
                        </div>
                      )}
                      
                      {/* Message */}
                      <div className="mb-6 flex-1">
                        <Text 
                          className="text-gray-800 leading-relaxed font-medium italic block text-center"
                          style={{ 
                            fontSize: 'clamp(1.125rem, 2.5vw, 2.5rem)',
                            lineHeight: '1.4'
                          }}
                        >
                          "{message.message}"
                        </Text>
                      </div>
                      
                      {/* To Info at Bottom Right */}
                      <div className="text-right">
                        <Text strong className="text-orange-700 text-lg md:text-xl block mb-1">
                          - Хэнд: {message.toName}
                        </Text>
                        <Text className="text-orange-600 text-sm md:text-base">
                          {formatDate(message.createdAt)}
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
                  Танд талархах зүйл байна уу?
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-20 px-20 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-2xl"
              >
                Мэндчилгээ илгээх
              </Button>
            </div>
          </div>
        ) : (
          /* Auto-Rotating Grid Mode */
          <div>
            <div className="mb-12 text-center">
              <Title level={2} className="text-orange-800! mb-4!">
                Талархлын мэндчилгээнүүд
              </Title>
              <Text className="text-orange-600 text-lg">Манай нийгэмлэгийн бүх сэтгэл хөдөлгөм мэндчилгээнүүд</Text>
              
              {/* Grid indicator dots */}
              {messages.length > MESSAGES_PER_GRID && (
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from({ length: getTotalGrids() }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentGridIndex 
                          ? 'bg-orange-600 scale-125' 
                          : 'bg-orange-200 hover:bg-orange-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Auto-rotating Grid with fade transition */}
            <div 
              className={`grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr transition-opacity duration-300 ${fadeClass}`}
            >
              {getCurrentGridMessages().map((message) => (
                <Card
                  key={message._id}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-300 rounded-xl overflow-hidden transform hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 20%, #fdf7f0 100%)',
                  }}
                  bodyStyle={{ 
                    padding: '32px 28px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* From Info at Top Left */}
                  <div className="mb-6 text-left">
                    <Text strong className="text-orange-700 text-base font-semibold">
                      Хэнээс: {message.fromName}
                    </Text>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center mb-6">
                    {/* Emoji */}
                    {message.emoji && (
                      <div className="mb-4">
                        <span className="text-4xl md:text-5xl">{message.emoji}</span>
                      </div>
                    )}
                    
                    {/* Message */}
                    <div className="px-2">
                      <Text className="text-gray-800 leading-relaxed text-base md:text-lg font-medium block">
                        "{message.message}"
                      </Text>
                    </div>
                  </div>
                  
                  {/* To Info at Bottom Right */}
                  <div className="text-right border-t border-orange-100 pt-4">
                    <Text strong className="text-orange-700 text-base font-semibold block mb-1">
                      - Хэнд: {message.toName}
                    </Text>
                    <Text type="secondary" className="text-xs text-orange-500">
                      {formatDate(message.createdAt)}
                    </Text>
                  </div>
                </Card>
              ))}
            </div>

            {/* Progress indicator */}
            {messages.length > MESSAGES_PER_GRID && (
              <div className="text-center mt-8">
                <Text className="text-orange-600 text-sm">
                  {currentGridIndex + 1} / {getTotalGrids()}
                </Text>
              </div>
            )}

            {/* Share Your Message Button - Below Grid */}
            <div className="text-center mt-16">
              <div className="mb-6">
                <Text className="text-orange-700 text-xl font-medium">
                  Танд талархах зүйл байна уу?
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="h-16 px-16 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
              >
                Мэндчилгээ илгээх
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-orange-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Text className="text-orange-100">
            Бүх хүмүүст талархал, баяр жаргалаар дүүрэн Талархлын баяр болтугай! 🧡
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
