import { Input, Form } from "antd";
import { Project } from '../../types/project';
import { UserSelect } from "../../components/user-select";
import { User } from "../../types/user";
import { useSetUrlQueryParam } from "../../utils/url";

interface SearchPannelProps {
    users: User[];
    param: Partial<Pick<Project,'name'|'personId'>>;
}

export const SearchPannel = ({ param, users }: SearchPannelProps) => {
    const setUrlParam = useSetUrlQueryParam<'name' | 'personId'>();

    return (
        <Form style={{marginBottom:'2rem'}} layout={"inline"} >
            <Form.Item>
                <Input.Search
                    placeholder={"项目名"}
                    allowClear
                    value={param.name}
                    onChange={(evt) => setUrlParam({ name: evt.target.value || undefined })}
                />
                
            </Form.Item>
            <Form.Item>
                <UserSelect 
                    defaultOptionName="负责人"
                    value={param.personId} 
                    onChange={(value:number | undefined)=>
                        setUrlParam({ personId: value })}/>
                
            </Form.Item>
        </Form>
    );
};

