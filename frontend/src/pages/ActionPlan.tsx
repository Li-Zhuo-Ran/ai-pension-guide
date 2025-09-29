import { useEffect, useState, useMemo } from 'react'
import { Card, Typography, List, Progress, Checkbox, Tag, Spin, Row, Col, Space, Alert, Button, Modal, Form, Input, Rate, Statistic, Divider, Avatar } from 'antd'
import { RobotOutlined, ClockCircleOutlined, TrophyOutlined, FireOutlined, StarOutlined, CheckCircleOutlined, HeartOutlined, AppleOutlined, HomeOutlined, CarOutlined, SmileOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import axios from 'axios'

type TaskItem = {
  id: string
  content: string
  priority: string
  completed: boolean
  progress: number
  difficulty: string
  estimated_time: number
  category?: string
  score?: number
  feedback?: string
}

type RecommendationData = {
  user_profile: string
  recommendations: {
    daily_actions: TaskItem[]
    weekly_goals: TaskItem[]
    long_term: TaskItem[]
  }
  generated_at: string
  valid_period: string
}

const api = axios.create({ baseURL: '/api' })

export default function ActionPlan() {
  const [data, setData] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [feedbackModal, setFeedbackModal] = useState<{visible: boolean, item?: TaskItem, category?: string, index?: number}>({visible: false})
  const [taskRatings, setTaskRatings] = useState<Record<string, number>>({})
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await api.get<RecommendationData>('/recommendation/1')
        setData(res.data)
      } catch (e: any) {
        console.error(e?.message || '加载失败')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const toggleTask = (category: string, taskId: string) => {
    // 实际应用中应调用API更新
    setData(prev => {
      if (!prev) return null
      const newData = {
        ...prev,
        recommendations: {
          ...prev.recommendations,
          [category]: prev.recommendations[category as keyof typeof prev.recommendations].map(item =>
            item.id === taskId ? { ...item, completed: !item.completed } : item
          )
        }
      }

      // 检查成就解锁
      const allTasks = [
        ...newData.recommendations.daily_actions,
        ...newData.recommendations.weekly_goals,
        ...newData.recommendations.long_term
      ]
      const completedCount = allTasks.filter(p => p.completed).length
      const newAchievements = [...achievements]

      if (completedCount >= 1 && !achievements.includes('第一笔储蓄')) {
        newAchievements.push('第一笔储蓄')
      }
      if (completedCount >= 5 && !achievements.includes('理财达人')) {
        newAchievements.push('理财达人')
      }
      if (completedCount >= allTasks.length && !achievements.includes('财务自由')) {
        newAchievements.push('财务自由')
      }

      if (newAchievements.length > achievements.length) {
        setAchievements(newAchievements)
        // 这里可以添加成就解锁的提示
      }

      return newData
    })
  }

  const getAllTasks = () => {
    if (!data) return []
    return [
      ...data.recommendations.daily_actions.map(item => ({ ...item, category: 'daily' })),
      ...data.recommendations.weekly_goals.map(item => ({ ...item, category: 'weekly' })),
      ...data.recommendations.long_term.map(item => ({ ...item, category: 'long_term' }))
    ]
  }

  const completedCount = getAllTasks().filter(p => p.completed).length
  const totalCount = getAllTasks().length

  const progressChartOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: '完成情况',
      type: 'pie',
      radius: '50%',
      data: [
        { value: completedCount, name: '已完成' },
        { value: totalCount - completedCount, name: '未完成' }
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  }), [completedCount, totalCount])

  const categoryChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['每日理财', '每周投资', '长期规划'] },
    yAxis: { type: 'value' },
    series: [{
      data: [
        data?.recommendations.daily_actions.filter(item => item.completed).length || 0,
        data?.recommendations.weekly_goals.filter(item => item.completed).length || 0,
        data?.recommendations.long_term.filter(item => item.completed).length || 0
      ],
      type: 'bar',
      itemStyle: { color: '#1890ff' }
    }]
  }), [data])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      default: return 'green'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green'
      case 'medium': return 'orange'
      default: return 'red'
    }
  }

  const handleFeedbackSubmit = () => {
    // 这里可以处理反馈提交逻辑
    setFeedbackModal({visible: false})
    setFeedbackText('')
  }

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }}>
      {/* 顶部统计面板 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Typography.Title level={2} style={{ color: 'white', margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>
              🚀 个性化养老金行动计划
            </Typography.Title>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
              AI驱动的个性化财务管理，让每一天都更富有
            </Typography.Text>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Card
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(82, 196, 26, 0.3)'
                  }}>
                    <CheckCircleOutlined style={{ fontSize: 32, color: 'white' }} />
                  </div>
                  <Typography.Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                    {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                  </Typography.Title>
                  <Typography.Text style={{ color: '#666' }}>完成进度</Typography.Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(24, 144, 255, 0.3)'
                  }}>
                    <TrophyOutlined style={{ fontSize: 32, color: 'white' }} />
                  </div>
                  <Typography.Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                    {achievements.length}
                  </Typography.Title>
                  <Typography.Text style={{ color: '#666' }}>解锁成就</Typography.Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                bodyStyle={{ padding: 20 }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fa8c16, #ffb347)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(250, 140, 22, 0.3)'
                  }}>
                    <StarOutlined style={{ fontSize: 32, color: 'white' }} />
                  </div>
                  <Typography.Title level={3} style={{ margin: 0, color: '#fa8c16' }}>
                    {totalCount}
                  </Typography.Title>
                  <Typography.Text style={{ color: '#666' }}>总任务数</Typography.Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* AI 智能建议 */}
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)',
          border: '1px solid #e1e8ed'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16
          }}>
            <SmileOutlined style={{ fontSize: 20, color: 'white' }} />
          </div>
          <div>
            <Typography.Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
              AI 智能建议
            </Typography.Title>
            <Typography.Text style={{ color: '#666' }}>
              基于您的{data?.user_profile}财务画像定制 • 有效期：{data?.valid_period}
            </Typography.Text>
          </div>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Alert
              message="🎯 执行重点"
              description="建议优先完成高优先级财务任务，建立良好理财习惯"
              type="info"
              showIcon
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="💡 进度提醒"
              description="保持每日理财任务完成率在80%以上效果更佳"
              type="warning"
              showIcon
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Alert
              message="🔥 连续奖励"
              description="连续7天完成理财任务解锁'理财专家'成就"
              type="success"
              showIcon
              style={{ borderRadius: 8 }}
            />
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 每日行动 */}
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircleOutlined style={{ fontSize: 16, color: 'white' }} />
                      </div>
                      <Typography.Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                        💰 每日理财行动
                      </Typography.Title>
                    </div>
                  }
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <List
                    dataSource={data?.recommendations.daily_actions || []}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '16px 0', border: 'none' }}>
                        <Card
                          style={{
                            width: '100%',
                            borderRadius: 12,
                            border: item.completed ? '2px solid #52c41a' : '1px solid #e1e8ed',
                            background: item.completed
                              ? 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
                              : 'white',
                            boxShadow: item.completed ? '0 4px 20px rgba(82, 196, 26, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease'
                          }}
                          bodyStyle={{ padding: 16 }}
                          hoverable
                          onClick={() => toggleTask('daily_actions', item.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Checkbox
                              checked={item.completed}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleTask('daily_actions', item.id)
                              }}
                              style={{ transform: 'scale(1.2)' }}
                            />
                            <div style={{ flex: 1 }}>
                              <Typography.Text style={{
                                fontSize: '16px',
                                color: item.completed ? '#52c41a' : '#1a1a1a',
                                textDecoration: item.completed ? 'line-through' : 'none',
                                fontWeight: 600,
                                marginBottom: 8,
                                display: 'block'
                              }}>
                                {item.content}
                              </Typography.Text>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <Tag color={getPriorityColor(item.priority)} style={{ fontSize: '12px' }}>
                                  {item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '中优先级' : '低优先级'}
                                </Tag>
                                <Tag color={getDifficultyColor(item.difficulty)} style={{ fontSize: '12px' }}>
                                  {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ fontSize: '12px' }}>
                                  {item.estimated_time}分钟
                                </Tag>
                                <Button
                                  size="small"
                                  type="text"
                                  icon={<StarOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFeedbackModal({visible: true, item, category: 'daily_actions', index})
                                  }}
                                  style={{ color: '#1890ff', fontSize: '12px' }}
                                >
                                  反馈
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>

                {/* 每周目标 */}
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TrophyOutlined style={{ fontSize: 16, color: 'white' }} />
                      </div>
                      <Typography.Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                        📈 每周投资目标
                      </Typography.Title>
                    </div>
                  }
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <List
                    dataSource={data?.recommendations.weekly_goals || []}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '16px 0', border: 'none' }}>
                        <Card
                          style={{
                            width: '100%',
                            borderRadius: 12,
                            border: item.completed ? '2px solid #52c41a' : '1px solid #e1e8ed',
                            background: item.completed
                              ? 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
                              : 'white',
                            boxShadow: item.completed ? '0 4px 20px rgba(82, 196, 26, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease'
                          }}
                          bodyStyle={{ padding: 16 }}
                          hoverable
                          onClick={() => toggleTask('weekly_goals', item.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Checkbox
                              checked={item.completed}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleTask('weekly_goals', item.id)
                              }}
                              style={{ transform: 'scale(1.2)' }}
                            />
                            <div style={{ flex: 1 }}>
                              <Typography.Text style={{
                                fontSize: '16px',
                                color: item.completed ? '#52c41a' : '#1a1a1a',
                                textDecoration: item.completed ? 'line-through' : 'none',
                                fontWeight: 600,
                                marginBottom: 8,
                                display: 'block'
                              }}>
                                {item.content}
                              </Typography.Text>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <Tag color={getPriorityColor(item.priority)} style={{ fontSize: '12px' }}>
                                  {item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '中优先级' : '低优先级'}
                                </Tag>
                                <Tag color={getDifficultyColor(item.difficulty)} style={{ fontSize: '12px' }}>
                                  {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ fontSize: '12px' }}>
                                  {item.estimated_time}分钟
                                </Tag>
                                <Button
                                  size="small"
                                  type="text"
                                  icon={<StarOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFeedbackModal({visible: true, item, category: 'weekly_goals', index})
                                  }}
                                  style={{ color: '#1890ff', fontSize: '12px' }}
                                >
                                  反馈
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>

                {/* 长期计划 */}
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fa8c16, #ffb347)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <StarOutlined style={{ fontSize: 16, color: 'white' }} />
                      </div>
                      <Typography.Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                        � 长期财务规划
                      </Typography.Title>
                    </div>
                  }
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <List
                    dataSource={data?.recommendations.long_term || []}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '16px 0', border: 'none' }}>
                        <Card
                          style={{
                            width: '100%',
                            borderRadius: 12,
                            border: item.completed ? '2px solid #52c41a' : '1px solid #e1e8ed',
                            background: item.completed
                              ? 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
                              : 'white',
                            boxShadow: item.completed ? '0 4px 20px rgba(82, 196, 26, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease'
                          }}
                          bodyStyle={{ padding: 16 }}
                          hoverable
                          onClick={() => toggleTask('long_term', item.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Checkbox
                              checked={item.completed}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleTask('long_term', item.id)
                              }}
                              style={{ transform: 'scale(1.2)' }}
                            />
                            <div style={{ flex: 1 }}>
                              <Typography.Text style={{
                                fontSize: '16px',
                                color: item.completed ? '#52c41a' : '#1a1a1a',
                                textDecoration: item.completed ? 'line-through' : 'none',
                                fontWeight: 600,
                                marginBottom: 8,
                                display: 'block'
                              }}>
                                {item.content}
                              </Typography.Text>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <Tag color={getPriorityColor(item.priority)} style={{ fontSize: '12px' }}>
                                  {item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '中优先级' : '低优先级'}
                                </Tag>
                                <Tag color={getDifficultyColor(item.difficulty)} style={{ fontSize: '12px' }}>
                                  {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ fontSize: '12px' }}>
                                  {item.estimated_time}分钟
                                </Tag>
                                <Button
                                  size="small"
                                  type="text"
                                  icon={<StarOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFeedbackModal({visible: true, item, category: 'long_term', index})
                                  }}
                                  style={{ color: '#1890ff', fontSize: '12px' }}
                                >
                                  反馈
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Card
                  title="📊 完成概览"
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <ReactECharts option={progressChartOption} style={{ height: 200 }} />
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="已完成"
                        value={completedCount}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="总任务"
                        value={totalCount}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card
                  title="📈 分类进度"
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <ReactECharts option={categoryChartOption} style={{ height: 200 }} />
                </Card>

                <Card
                  title="🏆 成就系统"
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  {achievements.length > 0 ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {achievements.map((achievement, idx) => (
                        <Card
                          key={idx}
                          size="small"
                          style={{
                            borderRadius: 8,
                            background: 'linear-gradient(135deg, #faad14 0%, #f39c12 100%)',
                            border: 'none',
                            textAlign: 'center'
                          }}
                          bodyStyle={{ padding: 12 }}
                        >
                          <TrophyOutlined style={{ fontSize: 24, color: 'white', marginBottom: 8 }} />
                          <Typography.Text style={{ color: 'white', fontWeight: 600 }}>
                            {achievement}
                          </Typography.Text>
                        </Card>
                      ))}
                    </Space>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                      <TrophyOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                      <Typography.Text style={{ color: '#999' }}>
                        继续完成任务，解锁精彩成就！
                      </Typography.Text>
                    </div>
                  )}
                </Card>

                <Card
                  title={<><RobotOutlined /> AI健康助手</>}
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e1e8ed',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Typography.Paragraph style={{ color: '#1a1a1a', marginBottom: 16 }}>
                    基于您的健康数据分析，AI助手建议您重点关注：
                  </Typography.Paragraph>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                      message="保持规律作息"
                      description="良好的财务规划是养老金积累的基础"
                      type="info"
                      showIcon
                      style={{ borderRadius: 8 }}
                    />
                    <Alert
                      message="适量运动"
                      description="每周3-5次有氧运动效果最佳"
                      type="success"
                      showIcon
                      style={{ borderRadius: 8 }}
                    />
                    <Alert
                      message="均衡饮食"
                      description="多摄入Omega-3和抗氧化食物"
                      type="warning"
                      showIcon
                      style={{ borderRadius: 8 }}
                    />
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </>
      )}

      {/* 反馈模态框 */}
      <Modal
        title="任务反馈"
        open={feedbackModal.visible}
        onOk={handleFeedbackSubmit}
        onCancel={() => setFeedbackModal({visible: false})}
        okText="提交"
        cancelText="取消"
      >
        {feedbackModal.item && (
          <Form layout="vertical">
            <Form.Item label="任务">
              <Typography.Text>{feedbackModal.item.content}</Typography.Text>
            </Form.Item>
            <Form.Item label="评分 (1-10)">
              <Rate
                value={taskRatings[feedbackModal.item?.id || ''] || feedbackModal.item?.score || 5}
                onChange={(value) => {
                  const item = feedbackModal.item
                  if (item?.id) {
                    setTaskRatings(prev => ({...prev, [item.id]: value}))
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="反馈意见">
              <Input.TextArea
                placeholder="请分享您的执行体验和建议..."
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Space>
  )
}