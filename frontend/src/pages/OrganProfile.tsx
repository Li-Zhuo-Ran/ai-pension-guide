import { useEffect, useState } from 'react'
import { Card, Typography, List, Tag, Spin, Tabs, Descriptions, Avatar } from 'antd'
import { HeartOutlined, AppleOutlined, ThunderboltOutlined, RestOutlined, ExperimentOutlined, BulbOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import axios from 'axios'

type FinancialDimensionInfo = {
  basic_info: {
    type: string
    functions: string[]
    related_risks: string[]
    risk_factors: string[]
  }
  related_risks: Array<any>
  beneficial_strategies: Array<any>
}

const api = axios.create({ baseURL: '/api' })

const financialDimensions = [
  { name: '财务基础', icon: <BulbOutlined />, color: '#64FFDA' },
  { name: '债务管理', icon: <ExperimentOutlined />, color: '#FF6B6B' },
  { name: '投资配置', icon: <HeartOutlined />, color: '#4ECDC4' },
  { name: '风险规划', icon: <ThunderboltOutlined />, color: '#45B7D1' },
  { name: '消费行为', icon: <AppleOutlined />, color: '#FFA07A' },
  { name: '收入结构', icon: <RestOutlined />, color: '#98D8C8' }
]

export default function OrganProfile() {
  const [selectedRegion, setSelectedRegion] = useState('财务基础')
  const [regionData, setRegionData] = useState<FinancialDimensionInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRegionData(selectedRegion)
  }, [selectedRegion])

  const loadRegionData = async (region: string) => {
    setLoading(true)
    try {
      const response = await api.get<FinancialDimensionInfo>(`/knowledge/brain-region/${region}`)
      setRegionData(response.data)
    } catch (error) {
      console.error('加载财务维度数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRegionIcon = (regionName: string) => {
    const region = financialDimensions.find(r => r.name === regionName)
    return region ? region.icon : <BulbOutlined />
  }

  const getRegionColor = (regionName: string) => {
    const region = financialDimensions.find(r => r.name === regionName)
    return region ? region.color : '#64FFDA'
  }

  const brainFunctionOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', textStyle: { color: '#fff' } },
    radar: {
      indicator: [
        { name: '储蓄能力', max: 100 },
        { name: '投资知识', max: 100 },
        { name: '风险管理', max: 100 },
        { name: '债务控制', max: 100 },
        { name: '财务规划', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '60%',
      axisName: { color: '#CCD6F6' },
      splitLine: { lineStyle: { color: '#233554' } },
      splitArea: { areaStyle: { color: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)'] } }
    },
    series: [{
      name: '财务能力雷达图',
      type: 'radar',
      data: [{
        value: [85, 78, 82, 88, 80],
        name: '当前状态',
        lineStyle: { color: '#64FFDA' },
        areaStyle: { color: 'rgba(100,255,218,0.1)' }
      }]
    }]
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <header style={{ backgroundColor: 'var(--card-bg)', padding: '20px 30px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <Typography.Title level={2} style={{ margin: 0, color: 'var(--primary-text)' }}>精准用户画像分析</Typography.Title>
        <Typography.Text style={{ color: 'var(--secondary-text)' }}>
          基于多维度数据的用户财务画像深度分析
        </Typography.Text>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '25px' }}>
        {/* 财务维度选择 */}
        <Card title="财务维度选择" style={{ gridColumn: 'span 3' }}>
          <List
            dataSource={financialDimensions}
            renderItem={(region) => (
              <List.Item
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedRegion === region.name ? 'var(--highlight-color)' : 'transparent',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
                onClick={() => setSelectedRegion(region.name)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar
                    icon={region.icon}
                    style={{
                      backgroundColor: selectedRegion === region.name ? '#fff' : region.color,
                      color: selectedRegion === region.name ? region.color : '#fff'
                    }}
                  />
                  <Typography.Text
                    style={{
                      color: selectedRegion === region.name ? '#fff' : 'var(--primary-text)',
                      fontWeight: selectedRegion === region.name ? 'bold' : 'normal'
                    }}
                  >
                    {region.name}
                  </Typography.Text>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* 维度详情 */}
        <Card title={`${selectedRegion} 详情`} style={{ gridColumn: 'span 9' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <Spin size="large" />
            </div>
          ) : regionData ? (
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="基本信息" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="维度类型">{regionData.basic_info.type}</Descriptions.Item>
                  <Descriptions.Item label="主要功能">
                    {regionData.basic_info.functions.map(func => (
                      <Tag key={func} color="blue" style={{ margin: '2px' }}>{func}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="相关风险">
                    {regionData.basic_info.related_risks.map(risk => (
                      <Tag key={risk} color="orange" style={{ margin: '2px' }}>{risk}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="风险因素">
                    {regionData.basic_info.risk_factors.map(factor => (
                      <Tag key={factor} color="red" style={{ margin: '2px' }}>{factor}</Tag>
                    ))}
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>

              <Tabs.TabPane tab="策略建议" key="2">
                <List
                  dataSource={regionData.beneficial_strategies}
                  renderItem={(strategy) => (
                    <List.Item>
                      <Card size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <Typography.Title level={5} style={{ margin: 0, color: 'var(--primary-text)' }}>
                              {strategy.category}
                            </Typography.Title>
                            <Typography.Text style={{ color: 'var(--secondary-text)' }}>
                              证据等级: {strategy.evidence_level}
                            </Typography.Text>
                            <div style={{ marginTop: 8 }}>
                              <Typography.Text strong>预期效果:</Typography.Text>
                              {strategy.expected_outcomes.map((outcome: string) => (
                                <Tag key={outcome} color="green" style={{ margin: '2px' }}>{outcome}</Tag>
                              ))}
                            </div>
                          </div>
                          <Tag color="blue">{strategy.recommended_duration}</Tag>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </Tabs.TabPane>
            </Tabs>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Typography.Text style={{ color: 'var(--secondary-text)' }}>
                无法加载财务维度数据
              </Typography.Text>
            </div>
          )}
        </Card>

        {/* 财务能力雷达图 */}
        <Card title="财务能力综合评估" style={{ gridColumn: 'span 6' }}>
          <ReactECharts option={brainFunctionOption} style={{ height: '300px' }} />
        </Card>

        {/* 个性化策略建议 */}
        <Card title="个性化策略建议" style={{ gridColumn: 'span 6' }}>
          <List
            dataSource={[
              { title: '储蓄优化', desc: '建立定期储蓄习惯和应急基金', priority: '高' },
              { title: '投资教育', desc: '学习基础投资知识和风险管理', priority: '高' },
              { title: '债务重组', desc: '优化债务结构降低利息支出', priority: '中' },
              { title: '财务规划', desc: '制定长期退休规划和目标', priority: '中' }
            ]}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <Typography.Text strong style={{ color: 'var(--primary-text)' }}>
                      {item.title}
                    </Typography.Text>
                    <br />
                    <Typography.Text style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
                      {item.desc}
                    </Typography.Text>
                  </div>
                  <Tag color={item.priority === '高' ? 'red' : 'orange'}>
                    {item.priority}优先级
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  )
}