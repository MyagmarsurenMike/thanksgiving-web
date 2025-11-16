'use client';

import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

interface SubmitMessageModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const SubmitMessageModal: React.FC<SubmitMessageModalProps> = ({
  visible,
  onClose,
  onSubmitSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { name: string; message: string; emoji?: string }) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Амжилттай илгээгдлээ!',
          description: 'Таны Талархлын баярын мессеж хүлээн авсан бөгөөд баталгаажуулалтын дараа нийтлэгдэх болно.',
          placement: 'topRight',
          duration: 4,
        });
        
        form.resetFields();
        onClose();
        onSubmitSuccess();
      } else {
        notification.error({
          message: 'Илгээхэд алдаа гарлаа',
          description: data.error || 'Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      notification.error({
        message: 'Сүлжээний алдаа',
        description: 'Мессеж илгээж чадсангүй. Интернэтээ шалгаад дахин оролдоно уу.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-orange-800">
          <SmileOutlined className="text-orange-600" />
          <span>Талархлын мессежээ хуваалцаарай</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="thanksgiving-modal"
    >
      <div className="py-4">
        <p className="text-gray-600 mb-6">
          Энэ жилийн Талархлын баяраар юунд талархаж байна вэ? Илгээсэн мессеж тань нийтлэгдэхийн өмнө шалгагдана.
        </p>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-orange-800 font-medium">Таны нэр</span>}
            name="name"
            rules={[
              { required: true, message: 'Нэрээ оруулна уу' },
              { max: 100, message: 'Нэр 100 тэмдэгтээс хэтрэхгүй' }
            ]}
          >
            <Input
              placeholder="Нэрээ оруулна уу"
              className="rounded-lg border-orange-200 focus:border-orange-400"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-orange-800 font-medium">Талархлын баярын мессеж</span>}
            name="message"
            rules={[
              { required: true, message: 'Мессежээ оруулна уу' },
              { max: 500, message: 'Мессеж 500 тэмдэгтээс хэтрэхгүй' }
            ]}
          >
            <Input.TextArea
              placeholder="Энэ жил та юунд талархаж байна вэ?"
              rows={4}
              className="rounded-lg border-orange-200 focus:border-orange-400"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-orange-800 font-medium">Emoji (заавал биш)</span>}
            name="emoji"
            rules={[
              { max: 10, message: 'Emoji 10 тэмдэгтээс хэтрэхгүй' }
            ]}
          >
            <Input
              placeholder="🦃 🍂 🥧 ❤️"
              className="rounded-lg border-orange-200 focus:border-orange-400"
              size="large"
            />
          </Form.Item>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCancel}
              className="flex-1 h-12 rounded-lg border-orange-300 text-orange-700 hover:border-orange-400"
            >
              Болих
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="flex-1 h-12 rounded-lg bg-orange-600 hover:bg-orange-700 border-orange-600"
            >
              {loading ? 'Илгээж байна...' : 'Мессеж илгээх'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default SubmitMessageModal;
