import { Button, Drawer, Form, Input } from 'antd';
import { ErrorBox } from '../../components/lib';
import { useAddEpic } from '../../utils/epic';

interface CreateEpicProps {
    open: boolean;
    onClose: () => void;
    projectId: number;
    projectName?: string;
}

export const CreateEpic = ({ open, onClose, projectId, projectName }: CreateEpicProps) => {
    const [form] = Form.useForm<{ name: string }>();
    const { mutateAsync, error, isLoading } = useAddEpic();

    const onFinish = async ({ name }: { name: string }) => {
        try {
            await mutateAsync({ name: name.trim(), projectId });
            form.resetFields();
            onClose();
        } catch {
            // Mutation error is displayed below; keep the form open for retry.
        }
    };

    return (
        <Drawer open={open} onClose={onClose} title="创建任务组" width={480}>
            <p>所属项目：{projectName || `项目 ${projectId}`}</p>
            <ErrorBox error={error} />
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, whitespace: true, message: '请输入任务组名称' }]}
                >
                    <Input placeholder="请输入任务组名称" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} disabled={!projectId}>
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
