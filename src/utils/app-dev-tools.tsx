import React from 'react'
import { Button, Drawer, InputNumber } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

type Props = {
  children: React.ReactNode
}

const FAILURE_RATE_KEY = '__jira_failure_rate__'

const readFailureRate = () => {
  const raw = window.localStorage.getItem(FAILURE_RATE_KEY)
  const parsed = Number(raw)
  if (Number.isNaN(parsed)) return 0
  return Math.min(100, Math.max(0, parsed))
}

export const AppDevTools: React.FC<Props> = ({ children }) => {
  const isDev = process.env.NODE_ENV === 'development'
  const [open, setOpen] = React.useState(false)
  const [failureRate, setFailureRate] = React.useState(0)

  React.useEffect(() => {
    if (!isDev) return
    setFailureRate(readFailureRate())
  }, [isDev])

  const handleChange = (value: number | null) => {
    const next = Math.min(100, Math.max(0, Number(value || 0)))
    setFailureRate(next)
    window.localStorage.setItem(FAILURE_RATE_KEY, String(next))
  }

  const reset = () => {
    setFailureRate(0)
    window.localStorage.removeItem(FAILURE_RATE_KEY)
  }

  if (!isDev) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 9999,
        }}
      >
        <Button
          type='primary'
          shape='circle'
          icon={<SettingOutlined />}
          onClick={() => setOpen(true)}
        />
      </div>
      <Drawer
        title='开发工具'
        placement='right'
        width={320}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label htmlFor='failure-rate-input'>请求失败率(0-100)</label>
          <InputNumber
            id='failure-rate-input'
            min={0}
            max={100}
            value={failureRate}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          <Button onClick={reset}>重置失败率</Button>
        </div>
      </Drawer>
    </>
  )
}

export default AppDevTools
