import { TabView, TabPanel } from 'primereact/tabview'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthTabs({ onLogin, onRegister, loading }) {
  return (
    <TabView>
      <TabPanel header="Login">
        <LoginForm onSubmit={onLogin} loading={loading} />
      </TabPanel>
      <TabPanel header="Register">
        <RegisterForm onSubmit={onRegister} loading={loading} />
      </TabPanel>
    </TabView>
  )
}


