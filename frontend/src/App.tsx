import { Layout, Menu, Typography } from 'antd'
import { BulbOutlined, LineChartOutlined, HeartOutlined, ScheduleOutlined, BarChartOutlined, RobotOutlined } from '@ant-design/icons'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import FutureInsights from './pages/FutureInsights'
import OrganProfile from './pages/OrganProfile'
import ActionPlan from './pages/ActionPlan'
import OutcomeEvaluation from './pages/OutcomeEvaluation'
import Assistant from './pages/Assistant'

const { Header, Content, Footer, Sider } = Layout

export default function App() {
  const [selectedKey, setSelectedKey] = useState('dashboard')

  const menuItems = [
    { key: 'dashboard', icon: <LineChartOutlined />, label: '智能投资仪表盘' },
    { key: 'organ', icon: <HeartOutlined />, label: '精准用户画像分析' },
    { key: 'future', icon: <BulbOutlined />, label: '投资未来洞察' },
    { key: 'action', icon: <ScheduleOutlined />, label: '智能投资行动方案' },
    { key: 'assistant', icon: <RobotOutlined />, label: 'AI投资助手' },
    { key: 'outcome', icon: <BarChartOutlined />, label: '投资成果评估' },
  ]

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />
      case 'organ':
        return <OrganProfile />
      case 'future':
        return <FutureInsights />
      case 'action':
        return <ActionPlan />
      case 'assistant':
        return <Assistant />
      case 'outcome':
        return <OutcomeEvaluation />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 48, margin: 16, color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 700 }}>智能投资顾问</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: 'var(--card-bg)', padding: '0 16px' }}>
          <Typography.Title level={4} style={{ margin: 0, color: 'var(--primary-text)' }}>
            {menuItems.find(item => item.key === selectedKey)?.label || '养老金规划'}
          </Typography.Title>
        </Header>
        <Content style={{ margin: 16 }}>
          {renderContent()}
        </Content>
        <Footer style={{ textAlign: 'center', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', color: 'var(--secondary-text)' }}>
          © {new Date().getFullYear()} Pension Planning
        </Footer>
      </Layout>
    </Layout>
  )
}
