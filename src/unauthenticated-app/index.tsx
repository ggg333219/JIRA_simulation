import React, { useState } from 'react';
import { RegisterScreen } from './register'
import { LoginScreen } from './login';
import { Divider } from 'antd';
import { Container, ShadowCard, LongButton, Title, Header, Background } from './styles';
import { ErrorBox } from '../components/lib';

export const UnauthenticatedApp: React.FC = () => {
    const [isRegister,setRegister] = useState(false);
    const [error,setError]=useState<Error|null>(null)
    return (
        <Container>
            <Header/>
            <Background/>
            <ShadowCard>
                <Title>
                    {isRegister ? '请注册' : '请登录'}
                </Title>
                <ErrorBox error={error}/>
                {isRegister ? <RegisterScreen /> : <LoginScreen />}
                <Divider />
                <LongButton htmlType="button" onClick={() => setRegister(!isRegister)}>
                    切换到{isRegister ? '登录' : '注册'}
                </LongButton>
            </ShadowCard>
        </Container>
    )
}
// styled components moved to ./styles