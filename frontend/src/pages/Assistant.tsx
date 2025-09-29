import { useEffect, useState, useRef } from 'react'
import { Card, Input, Button, List, Avatar, Typography, Tag, Spin, message } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons'
import axios from 'axios'

type Message = {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: string
  sentiment?: string
  tags?: Array<{ text: string; value: number }>
}

type ChatResponse = {
  original_message: string
  intent: { intent: string; confidence: number }
  sentiment: { sentiment: string; score: number }
  response: string
  tags: Array<{ text: string; value: number }>
  timestamp: string
}

const api = axios.create({ baseURL: '/api' })

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '您好！我是您的AI投资助手。我可以帮您分析财务状况、提供个性化投资建议、解答投资理财问题。请告诉我您想了解什么关于投资理财的问题？',
      timestamp: new Date().toISOString(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'zh-CN'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('语音识别错误:', event.error)
        setIsRecording(false)
        message.error('语音识别失败，请重试')
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true)
      recognitionRef.current.start()
    } else if (!recognitionRef.current) {
      message.error('您的浏览器不支持语音识别')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputValue
    setInputValue('')
    setLoading(true)

    try {
      // 检查是否是语音输入（简单检查是否包含语音相关的关键词或长度）
      const isVoiceInput = currentMessage.length > 50 || /今天|我|想|要|会|能|可以|钱|投资|退休|储蓄|债务|保险|理财|工资|收入|支出|预算/.test(currentMessage)

      let response
      if (isVoiceInput) {
        // 模拟语音数据（实际应用中需要录音）
        const audioData = btoa(currentMessage) // 简单编码，实际需要真实的音频数据
        response = await api.post('/assistant/voice-chat', {
          user_id: 1,
          audio: audioData
        })
      } else {
        response = await api.post<ChatResponse>('/assistant/chat', {
          user_id: 1,
          message: currentMessage
        })
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp,
        intent: response.data.intent?.intent,
        sentiment: response.data.sentiment?.sentiment,
        tags: response.data.tags
      }

      setMessages(prev => [...prev, assistantMessage])

      // 如果画像有更新，显示提示
      if (response.data.updated_profile) {
        message.success(`您的财务画像已更新为：${response.data.updated_profile}`)
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '抱歉，我现在无法回应。请稍后再试。',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getIntentColor = (intent?: string) => {
    const colors: { [key: string]: string } = {
      'financial_check': 'blue',
      'investment_advice': 'orange',
      'retirement_planning': 'green',
      'debt_management': 'purple',
      'savings_strategy': 'cyan',
      'general_chat': 'gray'
    }
    return colors[intent || ''] || 'gray'
  }

  const getSentimentColor = (sentiment?: string) => {
    const colors: { [key: string]: string } = {
      'positive': 'green',
      'negative': 'red',
      'neutral': 'blue'
    }
    return colors[sentiment || ''] || 'blue'
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: 'calc(100vh - 100px)' }}>
      <header style={{ backgroundColor: 'var(--card-bg)', padding: '20px 30px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Avatar size={50} icon={<RobotOutlined />} style={{ backgroundColor: 'var(--highlight-color)' }} />
          <div>
            <Typography.Title level={3} style={{ margin: 0, color: 'var(--primary-text)' }}>AI养老金顾问</Typography.Title>
            <Typography.Text style={{ color: 'var(--secondary-text)' }}>
              智能对话 • 财务分析 • 个性化规划建议
            </Typography.Text>
          </div>
        </div>
      </header>

      <Card
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item style={{
                padding: '16px 0',
                border: 'none',
                alignItems: 'flex-start'
              }}>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <Avatar
                    icon={message.type === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
                    style={{
                      backgroundColor: message.type === 'assistant' ? 'var(--highlight-color)' : 'var(--info-color)',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 8 }}>
                      <Typography.Text strong style={{ color: 'var(--primary-text)' }}>
                        {message.type === 'assistant' ? 'AI助手' : '您'}
                      </Typography.Text>
                      <Typography.Text style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography.Text>
                      {message.intent && (
                        <Tag color={getIntentColor(message.intent)} >
                          {message.intent === 'financial_check' ? '财务检查' :
                           message.intent === 'investment_advice' ? '投资建议' :
                           message.intent === 'retirement_planning' ? '退休规划' :
                           message.intent === 'debt_management' ? '债务管理' :
                           message.intent === 'savings_strategy' ? '储蓄策略' : '一般聊天'}
                        </Tag>
                      )}
                      {message.sentiment && (
                        <Tag color={getSentimentColor(message.sentiment)} >
                          {message.sentiment === 'positive' ? '积极' :
                           message.sentiment === 'negative' ? '消极' : '中性'}
                        </Tag>
                      )}
                    </div>
                    <Typography.Paragraph style={{
                      color: 'var(--primary-text)',
                      margin: 0,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message.content}
                    </Typography.Paragraph>
                    {message.tags && message.tags.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {message.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={index} style={{ marginRight: 8 }}>
                            {tag.text}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <Spin  />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{
          padding: '20px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-color)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您想说的话，或点击语音按钮..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--primary-text)'
              }}
            />
            <Button
              icon={isRecording ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                flexShrink: 0,
                backgroundColor: isRecording ? '#ff4d4f' : 'var(--highlight-color)',
                borderColor: isRecording ? '#ff4d4f' : 'var(--highlight-color)'
              }}
              title={isRecording ? '停止录音' : '开始语音输入'}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              loading={loading}
              disabled={!inputValue.trim()}
              style={{ flexShrink: 0 }}
            >
              发送
            </Button>
          </div>
          <Typography.Text style={{ color: 'var(--secondary-text)', fontSize: '12px', marginTop: 8, display: 'block' }}>
            按 Enter 发送，Shift + Enter 换行 • 支持语音输入
          </Typography.Text>
        </div>
      </Card>
    </div>
  )
}