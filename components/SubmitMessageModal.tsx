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
          message: 'Message Submitted!',
          description: 'Your Thanksgiving message has been submitted and is pending approval.',
          placement: 'topRight',
          duration: 4,
        });
        
        form.resetFields();
        onClose();
        onSubmitSuccess();
      } else {
        notification.error({
          message: 'Submission Failed',
          description: data.error || 'Failed to submit your message. Please try again.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      notification.error({
        message: 'Network Error',
        description: 'Unable to submit your message. Please check your connection and try again.',
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
          <span>Share Your Thanksgiving Message</span>
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
          Share what you're grateful for this Thanksgiving! Your message will be reviewed before appearing on the site.
        </p>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-orange-800 font-medium">Your Name</span>}
            name="name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { max: 100, message: 'Name cannot be more than 100 characters' }
            ]}
          >
            <Input
              placeholder="Enter your name"
              className="rounded-lg border-orange-200 focus:border-orange-400"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-orange-800 font-medium">Your Thanksgiving Message</span>}
            name="message"
            rules={[
              { required: true, message: 'Please enter your message' },
              { max: 500, message: 'Message cannot be more than 500 characters' }
            ]}
          >
            <Input.TextArea
              placeholder="What are you thankful for this year?"
              rows={4}
              className="rounded-lg border-orange-200 focus:border-orange-400"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-orange-800 font-medium">Emoji (Optional)</span>}
            name="emoji"
            rules={[
              { max: 10, message: 'Emoji cannot be more than 10 characters' }
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
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="flex-1 h-12 rounded-lg bg-orange-600 hover:bg-orange-700 border-orange-600"
            >
              {loading ? 'Submitting...' : 'Submit Message'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default SubmitMessageModal;