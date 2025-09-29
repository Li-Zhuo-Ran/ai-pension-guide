import { useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Statistic, Typography, Slider, Select, Button, Space, message, Tag, InputNumber, Progress, Alert, Timeline, Divider, Avatar, Checkbox, Calendar, Badge, Modal, Form, Input, Rate, Tabs, List, Popover } from 'antd'
import ReactECharts from 'echarts-for-react'
import axios from 'axios'
import { ClockCircleOutlined, HeartOutlined, AppleOutlined, HomeOutlined, CarOutlined, SmileOutlined, TrophyOutlined, FireOutlined, StarOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CalendarOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons'

type PersonaTheme = { color: string; glow: number; tone?: string }
type Persona = { title: string; description?: string; theme: PersonaTheme }

type Insights = {
  userId: number
  currentScore: number
  horizonMonths: number
  baselineCurve: number[]
  potentialCurve: number[]
  effectBreakdown: { name: string; delta: number }[]
  persona: { baseline: Persona; potential: Persona }
  whatIfConfig: any
}

type DailyPlanItem = {
  time: string
  category: string
  activity: string
  score: number
  feedback: string
  icon: string
  completed?: boolean
}

type SimulationResult = {
  scoreIncrease: number
  feedback: string
  dailyBreakdown: { day: number; score: number; feedback: string }[]
  dailyPlan: DailyPlanItem[]
}

const api = axios.create({ baseURL: '/api' })

export default function FutureInsights() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Insights | null>(null)
  const [controls, setControls] = useState({
    // 储蓄 (Savings)
    savings_increase: 1000,
    savings_frequency: 1,
    emergency_fund_target: 6,
    // 投资 (Investment)
    investment_increase: 500,
    investment_frequency: 1,
    risk_tolerance_adjust: 2,
    // 债务 (Debt)
    debt_reduction: 2000,
    debt_payment_frequency: 1,
    debt_consolidation: false,
    // 收入 (Income)
    side_income: 500,
    income_frequency: 1,
    career_advancement: 1,
    // 支出 (Expenses)
    expense_reduction: 300,
    expense_frequency: 1,
    budget_tracking: 5,
    // 保险 (Insurance)
    insurance_coverage: 2,
    insurance_frequency: 1,
    risk_management: 3,
    // 其他
    financial_education: 2,
    retirement_age_adjust: 65
  })
  const [simulationDays, setSimulationDays] = useState(30)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [realTimeUpdate, setRealTimeUpdate] = useState(false)
  const [dailyPlanCompleted, setDailyPlanCompleted] = useState<Record<number, boolean>>({})
  const [todayScore, setTodayScore] = useState(0)
  const [monthlyScore, setMonthlyScore] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [feedbackModal, setFeedbackModal] = useState<{visible: boolean, item?: DailyPlanItem, index?: number}>({visible: false})
  const [taskRatings, setTaskRatings] = useState<Record<number, number>>({})
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await api.get<Insights>('/future-insights/1')
        const d = res.data
        setData(d)
        // 初始化控件
        const cfg = d.whatIfConfig
        setControls({
          savings_increase: cfg.savings?.default || 1000,
          savings_frequency: cfg.savings_frequency?.default || 1,
          emergency_fund_target: cfg.emergency_fund?.default || 6,
          investment_increase: cfg.investment?.default || 500,
          investment_frequency: cfg.investment_frequency?.default || 1,
          risk_tolerance_adjust: cfg.risk_tolerance?.default || 2,
          debt_reduction: cfg.debt?.default || 2000,
          debt_payment_frequency: cfg.debt_frequency?.default || 1,
          debt_consolidation: cfg.debt_consolidation?.default || false,
          side_income: cfg.side_income?.default || 500,
          income_frequency: cfg.income_frequency?.default || 1,
          career_advancement: cfg.career?.default || 1,
          expense_reduction: cfg.expense?.default || 300,
          expense_frequency: cfg.expense_frequency?.default || 1,
          budget_tracking: cfg.budget?.default || 5,
          insurance_coverage: cfg.insurance?.default || 2,
          insurance_frequency: cfg.insurance_frequency?.default || 1,
          risk_management: cfg.risk_management?.default || 3,
          financial_education: cfg.financial_education?.default || 2,
          retirement_age_adjust: cfg.retirement_age?.default || 65
        })
      } catch (e: any) {
        message.error(e?.message || '加载失败')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const trendOption = useMemo(() => {
    if (!data) return {}
    const months = Array.from({ length: data.horizonMonths }, (_, i) => `${i + 1}月`)
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['维持现状', '潜能激发'] },
      grid: { left: 40, right: 24, bottom: 30, top: 30 },
      xAxis: { type: 'category', data: months, boundaryGap: false },
      yAxis: { type: 'value', min: 0, max: 100 },
      series: [
        { name: '维持现状', type: 'line', smooth: true, data: data.baselineCurve, lineStyle: { color: '#bdc3c7' } },
        { name: '潜能激发', type: 'line', smooth: true, data: data.potentialCurve, lineStyle: { color: '#16a085' }, areaStyle: { color: 'rgba(22,160,133,0.12)' } }
      ]
    }
  }, [data])

  const effectsOption = useMemo(() => {
    if (!data) return {}
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 60, right: 24, bottom: 30, top: 10 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: data.effectBreakdown.map(i => i.name) },
      series: [{ type: 'bar', data: data.effectBreakdown.map(i => i.delta), barWidth: 16, itemStyle: { color: '#3498db' } }]
    }
  }, [data])

  const progressChartOption = useMemo(() => {
    if (!simulationResult) return {}
    const completed = Object.values(dailyPlanCompleted).filter(Boolean).length
    const total = simulationResult.dailyPlan.length
    return {
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: completed, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: total - completed, name: '未完成', itemStyle: { color: '#f0f0f0' } }
        ],
        label: {
          formatter: '{b}: {c} ({d}%)'
        }
      }]
    }
  }, [simulationResult, dailyPlanCompleted])

  const categoryChartOption = useMemo(() => {
    if (!simulationResult) return {}
    const categories = ['心', '食', '住', '行', '衣']
    const categoryData = categories.map(cat => ({
      name: cat,
      value: simulationResult.dailyPlan.filter(item => item.category === cat).length
    }))
    return {
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: categoryData, itemStyle: { color: '#1890ff' } }]
    }
  }, [simulationResult])

  const handleControlChange = (key: string, value: any) => {
    setControls(c => ({ ...c, [key]: value }))
    if (realTimeUpdate) {
      // 延迟模拟以避免频繁调用
      setTimeout(() => simulate(), 500)
    }
  }

  const handlePlanItemToggle = (index: number, completed: boolean) => {
    setDailyPlanCompleted(prev => ({ ...prev, [index]: completed }))
    // 重新计算当日得分
    const newCompleted = { ...dailyPlanCompleted, [index]: completed }
    if (simulationResult) {
      const completedItems = simulationResult.dailyPlan.filter((_, idx) => newCompleted[idx])
      const totalScore = completedItems.reduce((sum, item) => sum + item.score, 0)
      const maxPossibleScore = simulationResult.dailyPlan.reduce((sum, item) => sum + item.score, 0)
      const todayScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
      setTodayScore(todayScore)
      // 本月得分暂时简单累加，实际可以从localStorage或后端获取历史
      setMonthlyScore(prev => prev + (completed ? todayScore : -todayScore))

      // 检查成就
      checkAchievements(newCompleted)
    }
  }

  const checkAchievements = (completed: Record<number, boolean>) => {
    const newAchievements = [...achievements]
    const completedCount = Object.values(completed).filter(Boolean).length
    const totalTasks = simulationResult?.dailyPlan.length || 0

    if (completedCount === totalTasks && !newAchievements.includes('全天达人')) {
      newAchievements.push('全天达人')
      message.success('🎉 恭喜获得"全天达人"成就！')
    }
    if (completedCount >= 5 && !newAchievements.includes('高效执行者')) {
      newAchievements.push('高效执行者')
      message.success('🎉 恭喜获得"高效执行者"成就！')
    }
    setAchievements(newAchievements)
  }

  const handleFeedbackSubmit = (values: any) => {
    // 这里可以发送反馈到后端
    console.log('Feedback:', values)
    message.success('感谢您的反馈！')
    setFeedbackModal({visible: false})
  }

  const simulate = async () => {
    if (!data) return
    setLoading(true)
    try {
      const res = await api.post(`/future-insights/${data.userId}/simulate`, { ...controls, days: simulationDays })
      const d: SimulationResult = res.data
      setSimulationResult(d)
      // 更新潜能画像和曲线（假设后端返回更新后的数据）
      // 这里简化，实际可能需要后端返回新的persona和curve
      message.success(`模拟完成！养老金提升 ${d.scoreIncrease} 分`)
    } catch (e: any) {
      message.error(e?.message || '模拟失败')
    } finally {
      setLoading(false)
    }
  }

  const personaCard = (p: Persona, title: string) => (
    <Card
      bordered
      style={{
        height: '100%',
        background: `linear-gradient(135deg, ${p.theme.color}20, ${p.theme.color}10)`,
        border: `2px solid ${p.theme.color}40`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 30% 30%, ${p.theme.color}15, transparent 70%)`,
        zIndex: 0
      }} />
      <Space direction="vertical" size={8} style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <Tag color={title === '潜能激发' ? 'green' : 'default'} style={{ alignSelf: 'flex-start' }}>{title}</Tag>
        <div style={{
          height: 80,
          borderRadius: 12,
          background: `linear-gradient(45deg, ${p.theme.color}, ${p.theme.color}80)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${p.theme.color}40`,
          margin: '8px 0'
        }}>
          <Typography.Title level={3} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {p.title}
          </Typography.Title>
        </div>
        {p.description && (
          <Typography.Paragraph
            style={{
              color: 'var(--primary-text)',
              marginBottom: 0,
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            {p.description}
          </Typography.Paragraph>
        )}
      </Space>
    </Card>
  )

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>{personaCard(data?.persona.baseline || { title: '', theme: { color: '#ccc', glow: .5 } }, '维持现状')}</Col>
        <Col xs={24} md={12}>{personaCard(data?.persona.potential || { title: '', theme: { color: '#ccc', glow: .5 } }, '潜能激发')}</Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="未来养老金趋势" loading={loading}>
            <ReactECharts option={trendOption} style={{ height: 320 }} notMerge lazyUpdate></ReactECharts>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="当前分数" loading={loading}>
            <Statistic title="养老金总分" value={data?.currentScore || 0} suffix="/100" />
          </Card>
          <Card title="行为影响拆解" style={{ marginTop: 16 }} loading={loading}>
            <ReactECharts option={effectsOption} style={{ height: 240 }} notMerge lazyUpdate></ReactECharts>
          </Card>
        </Col>
      </Row>

      <Card title={<Space><SmileOutlined /> 衣食住行心 全天行为模拟</Space>} loading={loading} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Typography.Text style={{ color: 'white' }}>模拟天数: {simulationDays} 天</Typography.Text>
              <Slider min={1} max={90} value={simulationDays} onChange={setSimulationDays} />
            </Col>
            <Col xs={24} md={12}>
              <Typography.Text style={{ color: 'white' }}>实时更新</Typography.Text>
              <Select value={realTimeUpdate} onChange={setRealTimeUpdate} style={{ width: '100%' }}>
                <Select.Option value={false}>手动模拟</Select.Option>
                <Select.Option value={true}>拖动实时更新</Select.Option>
              </Select>
            </Col>
          </Row>

          {/* 储蓄 (Savings) */}
          <Card size="small" title={<Space><HeartOutlined style={{ color: '#ff6b6b' }} /> 💰 储蓄 - 储蓄与应急基金</Space>} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>储蓄增加 (元/月): {controls.savings_increase}</Typography.Text>
                <Slider min={0} max={5000} step={100} value={controls.savings_increase} onChange={(v) => handleControlChange('savings_increase', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>储蓄频率 (次/月): {controls.savings_frequency}</Typography.Text>
                <Slider min={1} max={12} value={controls.savings_frequency} onChange={(v) => handleControlChange('savings_frequency', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>应急基金目标 (月): {controls.emergency_fund_target}</Typography.Text>
                <Slider min={3} max={12} value={controls.emergency_fund_target} onChange={(v) => handleControlChange('emergency_fund_target', v)} />
              </Col>
            </Row>
          </Card>

          {/* 投资 (Investment) */}
          <Card size="small" title={<Space><AppleOutlined style={{ color: '#51cf66' }} /> 📈 投资 - 投资与资产配置</Space>} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>投资增加 (元/月): {controls.investment_increase}</Typography.Text>
                <Slider min={0} max={2000} step={50} value={controls.investment_increase} onChange={(v) => handleControlChange('investment_increase', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>投资频率 (次/月): {controls.investment_frequency}</Typography.Text>
                <Slider min={1} max={12} value={controls.investment_frequency} onChange={(v) => handleControlChange('investment_frequency', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>风险承受调整 (1-5): {controls.risk_tolerance_adjust}</Typography.Text>
                <Slider min={1} max={5} value={controls.risk_tolerance_adjust} onChange={(v) => handleControlChange('risk_tolerance_adjust', v)} />
              </Col>
            </Row>
          </Card>

          {/* 债务 (Debt) */}
          <Card size="small" title={<Space><HomeOutlined style={{ color: '#74c0fc' }} /> 💳 债务 - 债务管理与偿还</Space>} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>债务减少 (元/月): {controls.debt_reduction}</Typography.Text>
                <Slider min={0} max={5000} step={100} value={controls.debt_reduction} onChange={(v) => handleControlChange('debt_reduction', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>还款频率 (次/月): {controls.debt_payment_frequency}</Typography.Text>
                <Slider min={1} max={12} value={controls.debt_payment_frequency} onChange={(v) => handleControlChange('debt_payment_frequency', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>债务整合</Typography.Text>
                <Select style={{ width: '100%' }} value={controls.debt_consolidation} onChange={(v) => handleControlChange('debt_consolidation', v)} options={[
                  { value: false, label: '否' }, { value: true, label: '是' }
                ]} />
              </Col>
            </Row>
          </Card>

          {/* 收入 (Income) */}
          <Card size="small" title={<Space><CarOutlined style={{ color: '#ffd43b' }} /> 💼 收入 - 收入增长与副业</Space>} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Row gutter={16}>
              <Col xs={24} md={6}>
                <Typography.Text style={{ color: 'white' }}>副业收入 (元/月): {controls.side_income}</Typography.Text>
                <Slider min={0} max={2000} step={50} value={controls.side_income} onChange={(v) => handleControlChange('side_income', v)} />
              </Col>
              <Col xs={24} md={6}>
                <Typography.Text style={{ color: 'white' }}>收入频率 (次/月): {controls.income_frequency}</Typography.Text>
                <Slider min={1} max={12} value={controls.income_frequency} onChange={(v) => handleControlChange('income_frequency', v)} />
              </Col>
              <Col xs={24} md={6}>
                <Typography.Text style={{ color: 'white' }}>职业发展 (1-5): {controls.career_advancement}</Typography.Text>
                <Slider min={1} max={5} value={controls.career_advancement} onChange={(v) => handleControlChange('career_advancement', v)} />
              </Col>
              <Col xs={24} md={6}>
                <Typography.Text style={{ color: 'white' }}>财务教育 (小时/周): {controls.financial_education}</Typography.Text>
                <Slider min={0} max={10} value={controls.financial_education} onChange={(v) => handleControlChange('financial_education', v)} />
              </Col>
            </Row>
          </Card>

          {/* 支出 (Expenses) */}
          <Card size="small" title={<Space><ClockCircleOutlined style={{ color: '#f783ac' }} /> 💸 支出 - 支出控制与预算</Space>} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>支出减少 (元/月): {controls.expense_reduction}</Typography.Text>
                <Slider min={0} max={2000} step={50} value={controls.expense_reduction} onChange={(v) => handleControlChange('expense_reduction', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>预算跟踪 (天/周): {controls.budget_tracking}</Typography.Text>
                <Slider min={1} max={7} value={controls.budget_tracking} onChange={(v) => handleControlChange('budget_tracking', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>退休年龄调整: {controls.retirement_age_adjust}</Typography.Text>
                <Slider min={55} max={75} value={controls.retirement_age_adjust} onChange={(v) => handleControlChange('retirement_age_adjust', v)} />
              </Col>
            </Row>
          </Card>

          {/* 保险与风险管理 */}
          <Card size="small" title="🛡️ 保险与风险管理" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>保险覆盖 (1-5): {controls.insurance_coverage}</Typography.Text>
                <Slider min={1} max={5} value={controls.insurance_coverage} onChange={(v) => handleControlChange('insurance_coverage', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>保险频率 (次/年): {controls.insurance_frequency}</Typography.Text>
                <Slider min={1} max={12} value={controls.insurance_frequency} onChange={(v) => handleControlChange('insurance_frequency', v)} />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: 'white' }}>风险管理 (1-5): {controls.risk_management}</Typography.Text>
                <Slider min={1} max={5} value={controls.risk_management} onChange={(v) => handleControlChange('risk_management', v)} />
              </Col>
            </Row>
          </Card>

          <Row gutter={16}>
            <Col span={24}>
              <Button type="primary" onClick={simulate} disabled={realTimeUpdate} size="large" style={{ width: '100%', height: 50, fontSize: 18 }}>
                🚀 应用模拟并生成全天计划
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      {simulationResult && (
        <Row gutter={16}>
          <Col span={24}>
            <Alert
              message={`🎉 模拟结果: 养老金提升 ${simulationResult.scoreIncrease} 分`}
              description={simulationResult.feedback}
              type="success"
              showIcon
            />
          </Col>
          <Col span={24}>
            <Card title="📊 今日表现" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="当日得分"
                    value={todayScore}
                    suffix="/ 100"
                    valueStyle={{ color: todayScore >= 80 ? '#52c41a' : todayScore >= 60 ? '#1890ff' : '#fa8c16' }}
                  />
                  <Progress percent={todayScore} strokeColor={todayScore >= 80 ? '#52c41a' : todayScore >= 60 ? '#1890ff' : '#fa8c16'} />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="本月累计得分"
                    value={monthlyScore}
                    suffix="分"
                    valueStyle={{ color: monthlyScore >= 2000 ? '#52c41a' : monthlyScore >= 1500 ? '#1890ff' : '#fa8c16' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="🤖 智能养老金行动方案" size="small">
              <Tabs defaultActiveKey="plan" type="card">
                <Tabs.TabPane tab="📅 每日计划" key="plan">
                  <Row gutter={16}>
                    <Col span={16}>
                      <Timeline mode="left">
                        {simulationResult.dailyPlan.map((item, idx) => (
                          <Timeline.Item key={idx} color={item.score > 7 ? 'green' : item.score > 4 ? 'blue' : 'orange'} dot={<Avatar size="small">{item.icon}</Avatar>}>
                            <Card size="small" style={{ background: dailyPlanCompleted[idx] ? '#f6ffed' : '#fff', border: dailyPlanCompleted[idx] ? '1px solid #b7eb8f' : '1px solid #d9d9d9' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Checkbox
                                      checked={dailyPlanCompleted[idx] || false}
                                      onChange={(e) => handlePlanItemToggle(idx, e.target.checked)}
                                    />
                                    <div>
                                      <Typography.Text strong>{item.time}</Typography.Text> - {item.activity}
                                      <br />
                                      <Typography.Text type="secondary">{item.feedback}</Typography.Text>
                                      <br />
                                      <Tag color={item.category === '心' ? 'red' : item.category === '食' ? 'orange' : item.category === '住' ? 'blue' : item.category === '行' ? 'green' : 'purple'}>
                                        {item.category}
                                      </Tag>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <Typography.Text strong style={{ color: item.score > 7 ? '#52c41a' : item.score > 4 ? '#1890ff' : '#fa8c16' }}>
                                    {item.score}/10
                                  </Typography.Text>
                                  <Progress percent={item.score * 10} size="small" showInfo={false} strokeColor={item.score > 7 ? '#52c41a' : item.score > 4 ? '#1890ff' : '#fa8c16'} />
                                  <br />
                                  <Button size="small" type="link" onClick={() => setFeedbackModal({visible: true, item, index: idx})}>
                                    反馈
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </Col>
                    <Col span={8}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Card title="� 完成进度" size="small">
                          <ReactECharts option={progressChartOption} style={{ height: 200 }} />
                        </Card>
                        <Card title="📈 类别分布" size="small">
                          <ReactECharts option={categoryChartOption} style={{ height: 200 }} />
                        </Card>
                      </Space>
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="🏆 成就系统" key="achievements">
                  <Row gutter={16}>
                    <Col span={24}>
                      <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={achievements}
                        renderItem={(achievement) => (
                          <List.Item>
                            <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #faad14, #f39c12)' }}>
                              <TrophyOutlined style={{ fontSize: 32, color: '#fff' }} />
                              <br />
                              <Typography.Text strong style={{ color: '#fff' }}>{achievement}</Typography.Text>
                            </Card>
                          </List.Item>
                        )}
                      />
                      {achievements.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                          <TrophyOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                          <br />
                          <Typography.Text type="secondary">暂无成就，继续努力吧！</Typography.Text>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="📈 进度追踪" key="progress">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="本周进度" size="small">
                        <Calendar
                          fullscreen={false}
                          dateCellRender={(date) => {
                            const day = date.date()
                            const completed = day <= currentDay ? Math.floor(Math.random() * 10) + 1 : 0
                            return completed > 0 ? (
                              <div style={{ textAlign: 'center' }}>
                                <Badge count={completed} color="#52c41a" />
                              </div>
                            ) : null
                          }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="月度统计" size="small">
                        <Statistic title="本月完成天数" value={currentDay} suffix="/ 30" />
                        <Statistic title="平均每日得分" value={Math.round(monthlyScore / Math.max(currentDay, 1))} />
                        <Statistic title="连续完成天数" value={3} />
                        <Statistic title="最高单日得分" value={95} />
                      </Card>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      )}

      {/* 反馈模态框 */}
      <Modal
        title="任务反馈"
        open={feedbackModal.visible}
        onOk={() => handleFeedbackSubmit(feedbackModal.index || 0)}
        onCancel={() => setFeedbackModal({visible: false})}
        okText="提交"
        cancelText="取消"
      >
        {feedbackModal.item && feedbackModal.index !== undefined && (
          <Form layout="vertical">
            <Form.Item label="任务">
              <Typography.Text>{feedbackModal.item.time} - {feedbackModal.item.activity}</Typography.Text>
            </Form.Item>
            <Form.Item label="评分 (1-10)">
              <Rate
                value={taskRatings[feedbackModal.index] || feedbackModal.item.score}
                onChange={(value) => {
                  setTaskRatings(prev => ({...prev, [feedbackModal.index!]: value}))
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
