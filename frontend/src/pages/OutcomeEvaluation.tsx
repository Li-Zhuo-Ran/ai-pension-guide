import { useEffect, useState } from 'react'
import { Card, Typography, Statistic, Row, Col, Progress } from 'antd'
import { TrophyOutlined, RiseOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

type EvaluationData = {
  goals: { name: string; current: number; target: number }[]
  achievements: string[]
  correlationData: { behavior: string; correlation: number }[]
}

export default function OutcomeEvaluation() {
  const [data, setData] = useState<EvaluationData | null>(null)

  useEffect(() => {
    // Mock data
    setData({
      goals: [
        { name: '储蓄金额增长', current: 5000, target: 10000 },
        { name: '投资组合收益', current: 8.5, target: 12 },
        { name: '每月理财任务', current: 4, target: 5 }
      ],
      achievements: [
        '连续7天完成理财计划',
        '投资收益突破10%',
        '债务减少15%'
      ],
      correlationData: [
        { behavior: '每日储蓄习惯', correlation: 0.8 },
        { behavior: '投资学习频率', correlation: 0.7 },
        { behavior: '预算控制能力', correlation: 0.6 },
        { behavior: '债务管理效率', correlation: 0.5 }
      ]
    })
  }, [])

  const correlationOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', textStyle: { color: '#fff' } },
    grid: { left: 60, right: 24, bottom: 30, top: 10 },
    xAxis: { type: 'value', name: '相关系数', min: 0, max: 1 },
    yAxis: { type: 'category', data: data?.correlationData.map(d => d.behavior) || [] },
    series: [{
      type: 'bar',
      data: data?.correlationData.map(d => d.correlation) || [],
      barWidth: 16,
      itemStyle: { color: 'var(--highlight-color)' }
    }]
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <Typography.Title level={2} style={{ color: 'var(--primary-text)' }}>养老金成果评估</Typography.Title>

      <Row gutter={16}>
        {data?.goals.map((goal, i) => (
          <Col span={8} key={i}>
            <Card>
              <Statistic
                title={goal.name}
                value={goal.current}
                suffix={`/${goal.target}`}
                valueStyle={{ color: 'var(--highlight-color)' }}
              />
              <Progress
                percent={(goal.current / goal.target) * 100}
                strokeColor="var(--highlight-color)"
                showInfo={false}
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="行为-财务指标关联分析">
        <ReactECharts option={correlationOption} style={{ height: '300px' }} />
      </Card>

      <Card title="财务成就徽章墙" extra={<TrophyOutlined />}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {data?.achievements.map((achievement, i) => (
            <div key={i} style={{
              padding: '16px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <RiseOutlined style={{ fontSize: '24px', color: 'var(--highlight-color)', marginBottom: 8 }} />
              <Typography.Text style={{ color: 'var(--primary-text)' }}>{achievement}</Typography.Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}