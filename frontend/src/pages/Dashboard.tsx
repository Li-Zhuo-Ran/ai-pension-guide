import { useEffect, useState } from 'react'
import { Card, Statistic, Typography, Progress, Tag, Avatar, Spin, Row, Col, Space, Select, Button } from 'antd'
import {
  BulbOutlined,
  CheckCircleOutlined,
  UserOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  AlertOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import axios from 'axios'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

type DashboardData = {
  userProfile: string
  investmentScore: number
  radarData: { categories: string[]; values: number[] }
  futurePrediction: number
  riskAssessment: { risk_level: string; risk_score: number; confidence: number }
  futureTrend: number[]
  consumptionAnalysis: {
    totalConsumption: number
    consumptionRate: number
    breakdown: { category: string; amount: number; percentage: number }[]
    insights: string[]
  }
  assetAllocation: {
    riskLevel: string
    totalAssets: number
    allocation: { assetType: string; percentage: number; amount: number; recommendation: string }[]
    monthlyInvestment: number
  }
  keyMetrics: { name: string; value: any; status: string; unit: string }[]
  planSnapshot: { completed: number; total: number }
  tagCloudData: { text: string; value: number; color?: string }[]
}

const api = axios.create({ baseURL: '/api' })

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedUserId, setSelectedUserId] = useState(1)

  const loadUserData = async (userId: number) => {
    setLoading(true)
    try {
      const res = await api.get<DashboardData>(`/dashboard/${userId}`)
      setData(res.data)
    } catch (e: any) {
      console.error(e?.message || '加载失败')
      // 设置默认数据以确保界面能正常显示
      setData({
        userProfile: '保守型投资者',
        investmentScore: 48,
        radarData: {
          categories: ['财务基础', '债务管理', '投资配置', '风险规划', '行为参与'],
          values: [43, 38, 76, 39, 50]
        },
        futurePrediction: 28.45,
        riskAssessment: {
          risk_level: 'low',
          risk_score: 0.000023,
          confidence: 0.85
        },
        futureTrend: [48, 47, 47, 46],
        consumptionAnalysis: {
          totalConsumption: 8500,
          consumptionRate: 0.75,
          breakdown: [
            { category: '餐饮消费', amount: 1200, percentage: 14.1 },
            { category: '住房消费', amount: 2500, percentage: 29.4 },
            { category: '交通消费', amount: 800, percentage: 9.4 }
          ],
          insights: ['消费控制良好', '建议增加教育投资']
        },
        assetAllocation: {
          riskLevel: '平衡型',
          totalAssets: 500000,
          allocation: [
            { assetType: '股票', percentage: 40, amount: 200000, recommendation: '建议配置40%的股票' },
            { assetType: '债券', percentage: 30, amount: 150000, recommendation: '建议配置30%的债券' },
            { assetType: '现金', percentage: 30, amount: 150000, recommendation: '建议配置30%的现金' }
          ],
          monthlyInvestment: 5000
        },
        keyMetrics: [
          { name: '财务基础评分', value: 85.5, status: 'good', unit: '' },
          { name: '债务比率', value: 72.3, status: 'warning', unit: '%' },
          { name: '投资配置', value: 68.9, status: 'good', unit: '%' },
          { name: '风险评估', value: 45.2, status: 'good', unit: '' }
        ],
        planSnapshot: { completed: 1, total: 5 },
        tagCloudData: [
          { text: '保守型投资者', value: 1000 },
          { text: '财务规划良好', value: 661 },
          { text: '投资组合优化', value: 661 },
          { text: '债务管理得当', value: 661 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData(selectedUserId)
  }, [selectedUserId])

  // 健康评分仪表盘
  const healthScoreGaugeOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      center: ['50%', '60%'],
      radius: '90%',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.2, '#ff4d4f'],
            [0.4, '#faad14'],
            [0.6, '#52c41a'],
            [0.8, '#13c2c2'],
            [1, '#1890ff']
          ]
        }
      },
      pointer: {
        length: '60%',
        width: 8,
        itemStyle: { color: '#1890ff' }
      },
      axisTick: { length: 12, lineStyle: { color: 'auto' } },
      splitLine: { length: 20, lineStyle: { color: 'auto' } },
      axisLabel: {
        color: '#CCD6F6',
        fontSize: 12,
        distance: -40
      },
      title: {
        offsetCenter: [0, '30%'],
        fontSize: 16,
        color: '#CCD6F6'
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '10%'],
        valueAnimation: true,
        formatter: '{value}分',
        color: '#64FFDA'
      },
      data: [{ value: data?.investmentScore || 0, name: '投资评分' }]
    }]
  }

  // 多维度雷达图
  const radarOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', textStyle: { color: '#fff' } },
    legend: {
      data: ['当前状态', '目标状态'],
      textStyle: { color: '#CCD6F6' },
      top: 10
    },
    radar: {
      indicator: (data?.radarData?.categories || ['财务基础', '债务管理', '投资配置', '风险规划', '行为参与']).map((cat, i) => ({
        name: cat,
        max: 100,
        color: '#CCD6F6'
      })),
      center: ['50%', '55%'],
      radius: '65%',
      splitLine: { lineStyle: { color: '#233554' } },
      splitArea: { areaStyle: { color: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)'] } },
      axisLine: { lineStyle: { color: '#233554' } }
    },
    series: [{
      name: '养老金维度分析',
      type: 'radar',
      data: [
        {
          value: data?.radarData?.values || [43, 38, 76, 39, 50],
          name: '当前状态',
          lineStyle: { color: '#64FFDA', width: 2 },
          areaStyle: { color: 'rgba(100,255,218,0.1)' },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          value: [80, 75, 85, 70, 75], // 目标状态
          name: '目标状态',
          lineStyle: { color: '#FFA07A', width: 2, type: 'dashed' },
          areaStyle: { color: 'rgba(255,160,122,0.1)' },
          symbol: 'diamond',
          symbolSize: 6
        }
      ]
    }]
  }

  // 健康趋势分析图
  const healthTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' },
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['养老金总分', '财务基础', '债务管理', '投资配置'],
      textStyle: { color: '#CCD6F6' },
      top: 10
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } },
      splitLine: { lineStyle: { color: '#233554', opacity: 0.3 } }
    },
    series: [
      {
        name: '养老金总分',
        type: 'line',
        stack: '总量',
        smooth: true,
        lineStyle: { color: '#64FFDA', width: 3 },
        areaStyle: { color: 'rgba(100,255,218,0.1)' },
        emphasis: { focus: 'series' },
        data: [45, 48, 46, 52, 49, 51, 48]
      },
      {
        name: '财务基础',
        type: 'line',
        stack: '总量',
        smooth: true,
        lineStyle: { color: '#FF6B6B', width: 2 },
        areaStyle: { color: 'rgba(255,107,107,0.1)' },
        data: [25, 28, 26, 29, 27, 30, 28]
      },
      {
        name: '债务管理',
        type: 'line',
        stack: '总量',
        smooth: true,
        lineStyle: { color: '#4ECDC4', width: 2 },
        areaStyle: { color: 'rgba(78,205,196,0.1)' },
        data: [15, 12, 18, 14, 16, 13, 19]
      },
      {
        name: '投资配置',
        type: 'line',
        stack: '总量',
        smooth: true,
        lineStyle: { color: '#45B7D1', width: 2 },
        areaStyle: { color: 'rgba(69,183,209,0.1)' },
        data: [75, 78, 72, 85, 79, 82, 76]
      }
    ]
  }

  // 健康指标环形图
  const metricsRingOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}%'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#CCD6F6' }
    },
    series: [
      {
        name: '健康指标',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: 85, name: '财务基础', itemStyle: { color: '#64FFDA' } },
          { value: 65, name: '债务管理', itemStyle: { color: '#FF6B6B' } },
          { value: 78, name: '投资配置', itemStyle: { color: '#4ECDC4' } },
          { value: 72, name: '风险规划', itemStyle: { color: '#45B7D1' } },
          { value: 58, name: '行为参与', itemStyle: { color: '#FFA07A' } }
        ]
      }
    ]
  }

  // 风险热力图
  const riskHeatmapOption = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' }
    },
    grid: { height: '50%', top: '10%' },
    xAxis: {
      type: 'category',
      data: ['财务', '债务', '投资', '风险', '行为', '规划'],
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } }
    },
    yAxis: {
      type: 'category',
      data: ['高风险', '中风险', '低风险'],
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      textStyle: { color: '#CCD6F6' },
      inRange: {
        color: ['#52c41a', '#faad14', '#ff4d4f']
      }
    },
    series: [{
      name: '风险分布',
      type: 'heatmap',
      data: [
        [0, 0, 20], [1, 0, 15], [2, 0, 25], [3, 0, 10], [4, 0, 30], [5, 0, 35],
        [0, 1, 45], [1, 1, 55], [2, 1, 40], [3, 1, 50], [4, 1, 45], [5, 1, 40],
        [0, 2, 35], [1, 2, 30], [2, 2, 35], [3, 2, 40], [4, 2, 25], [5, 2, 25]
      ],
      label: { show: true, color: '#fff' },
      emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 2 } }
    }]
  }

  // 词云图
  const tagCloudOption = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' },
      formatter: function (params: any) {
        return params.data.name + ': ' + params.data.value
      }
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '80%',
      sizeRange: [12, 60],
      rotationRange: [-45, 45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          const colors = ['#64FFDA', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#9C88FF', '#FFB142']
          return colors[Math.floor(Math.random() * colors.length)]
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: data?.tagCloudData && data.tagCloudData.length > 0 
        ? data.tagCloudData.map(item => ({ name: item.text, value: item.value }))
        : [
            { name: '保守型投资者', value: 1000 },
            { name: '财务规划良好', value: 661 },
            { name: '投资组合优化', value: 661 },
            { name: '债务管理得当', value: 661 },
            { name: '财务基础', value: 500 },
            { name: '风险规划', value: 450 },
            { name: '行为参与', value: 400 }
          ]
    }]
  }

  // 进度环形图
  const progressRingOption = {
    backgroundColor: 'transparent',
    series: [{
      name: '今日计划',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: { show: false },
      data: [
        {
          value: data?.planSnapshot?.completed || 1,
          name: '已完成',
          itemStyle: { color: '#52c41a' }
        },
        {
          value: (data?.planSnapshot?.total || 5) - (data?.planSnapshot?.completed || 1),
          name: '待完成',
          itemStyle: { color: 'rgba(255,255,255,0.1)' }
        }
      ]
    }]
  }

  // 指标趋势对比图
  const metricsTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['本周', '上周', '目标值'],
      textStyle: { color: '#CCD6F6' },
      top: 10
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['财务基础', '债务管理', '投资配置', '风险评估'],
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } },
      splitLine: { lineStyle: { color: '#233554', opacity: 0.3 } }
    },
    series: [
      {
        name: '本周',
        type: 'bar',
        data: [85.5, 72.3, 68.9, 45.2],
        itemStyle: { color: '#64FFDA' },
        barWidth: '20%'
      },
      {
        name: '上周',
        type: 'bar',
        data: [82.1, 75.8, 65.4, 48.7],
        itemStyle: { color: '#4ECDC4' },
        barWidth: '20%'
      },
      {
        name: '目标值',
        type: 'line',
        data: [90, 70, 75, 40],
        lineStyle: { color: '#FFA07A', width: 3 },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  }

  // 健康维度分析雷达图
  const healthDimensionOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', textStyle: { color: '#fff' } },
    radar: {
      indicator: [
        { name: '财务基础', max: 100 },
        { name: '债务管理', max: 100 },
        { name: '投资配置', max: 100 },
        { name: '风险规划', max: 100 },
        { name: '行为参与', max: 100 },
        { name: '退休规划', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '65%',
      splitLine: { lineStyle: { color: '#233554' } },
      splitArea: { areaStyle: { color: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)'] } },
      axisLine: { lineStyle: { color: '#233554' } },
      axisName: { color: '#CCD6F6' }
    },
    series: [{
      name: '养老金维度分析',
      type: 'radar',
      data: [
        {
          value: [85, 65, 78, 72, 58, 70],
          name: '当前水平',
          lineStyle: { color: '#64FFDA', width: 2 },
          areaStyle: { color: 'rgba(100,255,218,0.1)' }
        },
        {
          value: [90, 75, 85, 80, 70, 75],
          name: '目标水平',
          lineStyle: { color: '#FFA07A', width: 2, type: 'dashed' },
          areaStyle: { color: 'rgba(255,160,122,0.1)' }
        }
      ]
    }]
  }

  // 指标分布箱线图
  const metricsBoxplotOption = {
    backgroundColor: 'transparent',
    title: {
      text: '养老金指标分布分析',
      left: 'center',
      textStyle: { color: '#CCD6F6' }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['财务基础', '债务管理', '投资配置', '风险评估'],
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } },
      splitLine: { lineStyle: { color: '#233554', opacity: 0.3 } }
    },
    series: [{
      name: '指标分布',
      type: 'boxplot',
      data: [
        [70, 80, 85.5, 90, 95], // 财务基础分布
        [50, 60, 72.3, 80, 90], // 债务管理分布
        [40, 55, 68.9, 75, 85], // 投资配置分布
        [20, 30, 45.2, 60, 70]  // 风险评估分布
      ],
      itemStyle: { color: '#64FFDA', borderColor: '#4ECDC4' },
      emphasis: { itemStyle: { color: '#FFA07A' } }
    }]
  }

  // 健康因素关联散点图
  const correlationScatterOption = {
    backgroundColor: 'transparent',
    title: {
      text: '投资配置 vs 风险评估',
      left: 'center',
      textStyle: { color: '#CCD6F6' }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' },
      formatter: function (params: any) {
        return `投资配置: ${params.data[0]}%<br/>风险评估: ${params.data[1]}`
      }
    },
    grid: { left: '10%', right: '15%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'value',
      name: '投资配置(%)',
      nameTextStyle: { color: '#CCD6F6' },
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } },
      splitLine: { lineStyle: { color: '#233554', opacity: 0.3 } }
    },
    yAxis: {
      type: 'value',
      name: '风险评估',
      nameTextStyle: { color: '#CCD6F6' },
      axisLabel: { color: '#CCD6F6' },
      axisLine: { lineStyle: { color: '#233554' } },
      splitLine: { lineStyle: { color: '#233554', opacity: 0.3 } }
    },
    series: [{
      name: '投资 vs 风险',
      type: 'scatter',
      symbolSize: function (val: any) {
        return Math.sqrt(val[2]) * 2
      },
      data: [
        [65.2, 45, 50], [72.8, 38, 60], [68.9, 42, 70], [75.5, 35, 80],
        [58.3, 52, 40], [61.7, 48, 55], [70.1, 40, 75], [55.9, 58, 35]
      ],
      itemStyle: {
        color: function (params: any) {
          const colors = ['#64FFDA', '#4ECDC4', '#45B7D1', '#FFA07A']
          return colors[params.dataIndex % colors.length]
        }
      }
    }]
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      minHeight: '100vh',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(100,255,218,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,160,122,0.1) 0%, transparent 50%)'
    }}>
      {/* 用户选择器 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(42,42,42,0.9) 100%)',
              border: '1px solid rgba(100,255,218,0.3)',
              boxShadow: '0 8px 32px rgba(100,255,218,0.1)',
              backdropFilter: 'blur(10px)'
            }}
            headStyle={{ borderBottom: '1px solid rgba(100,255,218,0.2)' }}
          >
            <Space>
              <Typography.Text style={{ color: '#64FFDA', fontWeight: 'bold' }}>选择用户:</Typography.Text>
              <Select
                value={selectedUserId}
                onChange={setSelectedUserId}
                style={{
                  width: 120,
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(100,255,218,0.3)'
                }}
                dropdownStyle={{ background: 'rgba(26,26,26,0.95)' }}
                options={[
                  { value: 1, label: '用户 1' },
                  { value: 2, label: '用户 2' },
                  { value: 3, label: '用户 3' },
                  { value: 4, label: '用户 4' },
                  { value: 5, label: '用户 5' }
                ]}
              />
              <Button
                type="primary"
                onClick={() => loadUserData(selectedUserId)}
                style={{
                  background: 'linear-gradient(135deg, #64FFDA 0%, #4ECDC4 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(100,255,218,0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(100,255,218,0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(100,255,218,0.3)'}
              >
                刷新数据
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 顶部用户信息区域 */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={8}>
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(100,255,218,0.3)',
                  boxShadow: '0 8px 32px rgba(100,255,218,0.15)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{ borderBottom: '1px solid rgba(100,255,218,0.2)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(100,255,218,0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(100,255,218,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    style={{
                      border: '3px solid #64FFDA',
                      boxShadow: '0 0 20px rgba(100,255,218,0.3)',
                      background: 'linear-gradient(135deg, #64FFDA 0%, #4ECDC4 100%)'
                    }}
                  />
                  <div>
                    <Typography.Title level={3} style={{ margin: 0, color: '#64FFDA', textShadow: '0 0 10px rgba(100,255,218,0.5)' }}>
                      用户ID: {selectedUserId}
                    </Typography.Title>
                    <Typography.Text style={{ color: '#CCD6F6' }}>养老金档案</Typography.Text>
                    <br />
                    <Tag
                      color="cyan"
                      style={{
                        marginTop: '8px',
                        background: 'linear-gradient(135deg, rgba(100,255,218,0.2) 0%, rgba(78,205,196,0.2) 100%)',
                        border: '1px solid rgba(100,255,218,0.5)',
                        color: '#64FFDA'
                      }}
                    >
                      {data?.userProfile}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(255,160,122,0.3)',
                  boxShadow: '0 8px 32px rgba(255,160,122,0.15)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{ borderBottom: '1px solid rgba(255,160,122,0.2)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,160,122,0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,160,122,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ReactECharts option={healthScoreGaugeOption} style={{ height: '200px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(69,183,209,0.3)',
                  boxShadow: '0 8px 32px rgba(69,183,209,0.15)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{ borderBottom: '1px solid rgba(69,183,209,0.2)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(69,183,209,0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(69,183,209,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Typography.Title level={4} style={{ color: '#CCD6F6', marginBottom: '16px' }}>今日计划进度</Typography.Title>
                  <ReactECharts option={progressRingOption} style={{ height: '120px' }} />
                  <Typography.Text style={{ color: '#45B7D1', fontSize: '16px', display: 'block', marginTop: '8px' }}>
                    {data?.planSnapshot?.completed}/{data?.planSnapshot?.total} 已完成
                  </Typography.Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 主要图表区域 */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} xl={12}>
              <Card
                title={<span style={{ color: '#64FFDA', fontSize: '18px', fontWeight: 'bold' }}>🕸️ 多维度健康雷达图</span>}
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(100,255,218,0.3)',
                  boxShadow: '0 8px 32px rgba(100,255,218,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{
                  borderBottom: '1px solid rgba(100,255,218,0.2)',
                  background: 'linear-gradient(135deg, rgba(100,255,218,0.1) 0%, rgba(78,205,196,0.1) 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(100,255,218,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(100,255,218,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ReactECharts option={radarOption} style={{ height: '400px' }} />
              </Card>
            </Col>
            <Col xs={24} xl={12}>
              <Card
                title={<span style={{ color: '#FFA07A', fontSize: '18px', fontWeight: 'bold' }}>📊 健康趋势分析</span>}
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(255,160,122,0.3)',
                  boxShadow: '0 8px 32px rgba(255,160,122,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{
                  borderBottom: '1px solid rgba(255,160,122,0.2)',
                  background: 'linear-gradient(135deg, rgba(255,160,122,0.1) 0%, rgba(255,107,107,0.1) 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,160,122,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,160,122,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ReactECharts option={healthTrendOption} style={{ height: '400px' }} />
              </Card>
            </Col>
          </Row>

          {/* 健康指标和风险分析 */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={8}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>📈 健康指标分布</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={metricsRingOption} style={{ height: '300px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>🔥 风险热力图</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={riskHeatmapOption} style={{ height: '300px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>🏷️ 健康标签云</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={tagCloudOption} style={{ height: '300px' }} />
              </Card>
            </Col>
          </Row>

          {/* 消费分析和资产配置 */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} xl={12}>
              <Card
                title={<span style={{ color: '#64FFDA', fontSize: '18px', fontWeight: 'bold' }}>💳 消费行为分析</span>}
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(100,255,218,0.3)',
                  boxShadow: '0 8px 32px rgba(100,255,218,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{
                  borderBottom: '1px solid rgba(100,255,218,0.2)',
                  background: 'linear-gradient(135deg, rgba(100,255,218,0.1) 0%, rgba(78,205,196,0.1) 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(100,255,218,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(100,255,218,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <Statistic
                    title={<span style={{ color: '#CCD6F6' }}>月总消费</span>}
                    value={data?.consumptionAnalysis?.totalConsumption || 0}
                    prefix="¥"
                    valueStyle={{ color: '#64FFDA', fontSize: '24px' }}
                  />
                  <Statistic
                    title={<span style={{ color: '#CCD6F6' }}>消费占比</span>}
                    value={((data?.consumptionAnalysis?.consumptionRate || 0) * 100).toFixed(1)}
                    suffix="%"
                    valueStyle={{ color: '#FFA07A', fontSize: '18px' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <Typography.Text style={{ color: '#CCD6F6', fontWeight: 'bold' }}>消费洞察:</Typography.Text>
                  <ul style={{ color: '#CCD6F6', marginTop: '8px' }}>
                    {data?.consumptionAnalysis?.insights?.map((insight, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{insight}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Typography.Text style={{ color: '#CCD6F6', fontWeight: 'bold' }}>主要消费类别:</Typography.Text>
                  <div style={{ marginTop: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                    {data?.consumptionAnalysis?.breakdown?.slice(0, 8).map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#CCD6F6' }}>{item.category}</span>
                        <span style={{ color: '#64FFDA' }}>¥{item.amount.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} xl={12}>
              <Card
                title={<span style={{ color: '#FFA07A', fontSize: '18px', fontWeight: 'bold' }}>📊 资产配置建议</span>}
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.95) 100%)',
                  border: '1px solid rgba(255,160,122,0.3)',
                  boxShadow: '0 8px 32px rgba(255,160,122,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                headStyle={{
                  borderBottom: '1px solid rgba(255,160,122,0.2)',
                  background: 'linear-gradient(135deg, rgba(255,160,122,0.1) 0%, rgba(255,107,107,0.1) 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,160,122,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,160,122,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <Statistic
                    title={<span style={{ color: '#CCD6F6' }}>总资产</span>}
                    value={data?.assetAllocation?.totalAssets || 0}
                    prefix="¥"
                    valueStyle={{ color: '#FFA07A', fontSize: '24px' }}
                  />
                  <Statistic
                    title={<span style={{ color: '#CCD6F6' }}>风险等级</span>}
                    value={data?.assetAllocation?.riskLevel || '未知'}
                    valueStyle={{ color: '#FFD700', fontSize: '18px' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <Statistic
                    title={<span style={{ color: '#CCD6F6' }}>建议月投资</span>}
                    value={data?.assetAllocation?.monthlyInvestment || 0}
                    prefix="¥"
                    valueStyle={{ color: '#64FFDA', fontSize: '18px' }}
                  />
                </div>
                <div>
                  <Typography.Text style={{ color: '#CCD6F6', fontWeight: 'bold' }}>资产配置建议:</Typography.Text>
                  <div style={{ marginTop: '12px' }}>
                    {data?.assetAllocation?.allocation?.map((item, index) => (
                      <div key={index} style={{ marginBottom: '12px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#CCD6F6', fontWeight: 'bold' }}>{item.assetType}</span>
                          <span style={{ color: '#64FFDA' }}>{item.percentage}%</span>
                        </div>
                        <div style={{ color: '#FFA07A', fontSize: '12px' }}>
                          ¥{item.amount.toLocaleString()}
                        </div>
                        <div style={{ color: '#CCD6F6', fontSize: '12px', marginTop: '4px' }}>
                          {item.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 核心指标卡片 */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>📋 核心健康指标</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <Row gutter={[16, 16]}>
                  {data?.keyMetrics.map((metric, i) => (
                    <Col xs={24} sm={12} md={6} key={i}>
                      <Card
                        size="small"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          textAlign: 'center'
                        }}
                      >
                        <Statistic
                          title={<span style={{ color: '#CCD6F6', fontSize: '14px' }}>{metric.name}</span>}
                          value={metric.value}
                          suffix={metric.unit}
                          valueStyle={{
                            color: metric.status === 'good' ? '#52c41a' :
                                   metric.status === 'warning' ? '#faad14' : '#ff4d4f',
                            fontSize: '24px'
                          }}
                        />
                        <Tag
                          color={metric.status === 'good' ? 'green' : metric.status === 'warning' ? 'orange' : 'red'}
                          style={{ marginTop: '8px' }}
                        >
                          {metric.status === 'good' ? '良好' : metric.status === 'warning' ? '需关注' : '异常'}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>

          {/* 指标详细分析 */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={12}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>📊 指标趋势对比</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={metricsTrendOption} style={{ height: '350px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>🎯 养老金维度分析</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={healthDimensionOption} style={{ height: '350px' }} />
              </Card>
            </Col>
          </Row>

          {/* 高级数据可视化 */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} xl={12}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>📦 指标分布箱线图</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={metricsBoxplotOption} style={{ height: '350px' }} />
              </Card>
            </Col>
            <Col xs={24} xl={12}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>🔗 健康因素关联</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <ReactECharts option={correlationScatterOption} style={{ height: '350px' }} />
              </Card>
            </Col>
          </Row>

          {/* 健康维度详细分析 */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>🔍 健康维度详细分析</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={6}>
                    <Card
                      size="small"
                      title={<span style={{ color: '#64FFDA', fontSize: '16px' }}>🧠 认知功能</span>}
                      style={{ background: 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.2)' }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <Progress
                          type="circle"
                          percent={85}
                          strokeColor="#64FFDA"
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>MMSE评分: </Typography.Text>
                          <Typography.Text style={{ color: '#64FFDA' }}>28.46</Typography.Text>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>记忆力: </Typography.Text>
                          <Tag color="green">良好</Tag>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>注意力: </Typography.Text>
                          <Tag color="orange">需改善</Tag>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card
                      size="small"
                      title={<span style={{ color: '#FF6B6B', fontSize: '16px' }}>😊 情绪健康</span>}
                      style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.2)' }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <Progress
                          type="circle"
                          percent={65}
                          strokeColor="#FF6B6B"
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>抑郁指数: </Typography.Text>
                          <Typography.Text style={{ color: '#FF6B6B' }}>19</Typography.Text>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>焦虑水平: </Typography.Text>
                          <Tag color="red">偏高</Tag>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>压力管理: </Typography.Text>
                          <Tag color="orange">需关注</Tag>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card
                      size="small"
                      title={<span style={{ color: '#4ECDC4', fontSize: '16px' }}>😴 睡眠质量</span>}
                      style={{ background: 'rgba(78,205,196,0.05)', border: '1px solid rgba(78,205,196,0.2)' }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <Progress
                          type="circle"
                          percent={78}
                          strokeColor="#4ECDC4"
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>睡眠时长: </Typography.Text>
                          <Typography.Text style={{ color: '#4ECDC4' }}>7.70h</Typography.Text>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>深睡比例: </Typography.Text>
                          <Tag color="green">23%</Tag>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>睡眠效率: </Typography.Text>
                          <Tag color="green">85%</Tag>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card
                      size="small"
                      title={<span style={{ color: '#45B7D1', fontSize: '16px' }}>🏃 身体健康</span>}
                      style={{ background: 'rgba(69,183,209,0.05)', border: '1px solid rgba(69,183,209,0.2)' }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <Progress
                          type="circle"
                          percent={72}
                          strokeColor="#45B7D1"
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>今日步数: </Typography.Text>
                          <Typography.Text style={{ color: '#45B7D1' }}>5,170</Typography.Text>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>心率: </Typography.Text>
                          <Tag color="green">72 bpm</Tag>
                        </div>
                        <div>
                          <Typography.Text style={{ color: '#CCD6F6', fontSize: '12px' }}>体能状态: </Typography.Text>
                          <Tag color="orange">一般</Tag>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* 风险评估区域 */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} md={12}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>⚠️ 风险评估</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Typography.Text style={{ color: '#CCD6F6' }}>风险等级: </Typography.Text>
                    <Tag
                      color={data?.riskAssessment?.risk_level === 'high' ? 'red' :
                             data?.riskAssessment?.risk_level === 'medium' ? 'orange' : 'green'}
                    >
                      {data?.riskAssessment?.risk_level === 'high' ? '高风险' :
                       data?.riskAssessment?.risk_level === 'medium' ? '中风险' : '低风险'}
                    </Tag>
                  </div>
                  <div>
                    <Typography.Text style={{ color: '#CCD6F6' }}>风险评分: </Typography.Text>
                    <Typography.Text style={{ color: '#FF6B6B', fontSize: '18px' }}>
                      {(data?.riskAssessment?.risk_score || 0).toFixed(1)}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text style={{ color: '#CCD6F6' }}>置信度: </Typography.Text>
                    <Progress
                      percent={((data?.riskAssessment?.confidence || 0) * 100)}
                      strokeColor="#64FFDA"
                      showInfo={false}
                    />
                    <Typography.Text style={{ color: '#64FFDA', marginLeft: '8px' }}>
                      {((data?.riskAssessment?.confidence || 0) * 100).toFixed(1)}%
                    </Typography.Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={<span style={{ color: '#64FFDA' }}>🔮 未来预测</span>}
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333' }}
                headStyle={{ borderBottom: '1px solid #333' }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Typography.Text style={{ color: '#CCD6F6' }}>预测MMSE评分: </Typography.Text>
                    <Typography.Text style={{ color: '#FFA07A', fontSize: '24px', fontWeight: 'bold' }}>
                      {data?.futurePrediction?.toFixed(1)}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text style={{ color: '#CCD6F6' }}>趋势: </Typography.Text>
                    <Space>
                      <RiseOutlined style={{ color: '#52c41a' }} />
                      <Typography.Text style={{ color: '#52c41a' }}>整体向好</Typography.Text>
                    </Space>
                  </div>
                  <div>
                    <Typography.Text style={{ color: '#CCD6F6', display: 'block', marginBottom: '8px' }}>
                      建议重点关注:
                    </Typography.Text>
                    <Space wrap>
                      <Tag color="orange">情绪管理</Tag>
                      <Tag color="blue">认知训练</Tag>
                      <Tag color="green">睡眠改善</Tag>
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}
