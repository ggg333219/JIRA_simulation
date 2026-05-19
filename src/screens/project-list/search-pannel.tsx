import { Select, Input, Form } from "antd";
import { Project } from "./list";
import { UserSelect } from "../../components/user-select";
const { Option } = Select;

export interface User {
    name: string;
    id: string;
    email: string;
    title: string;
    organization: string;
    token: string;
}

interface SearchPannelProps {
    users: User[];
    param: Partial<Pick<Project,'name'|'personId'>>;
    // 可以传入undefined
    setParam: (param: Partial<Pick<Project,'name'|'personId'>>) => void;
}

export const SearchPannel = ({ param, setParam, users }: SearchPannelProps) => {
    return (
        <Form style={{marginBottom:'2rem'}} layout={"inline"} >
            <Form.Item>
                <Input
                    placeholder={"项目名"}
                    type="text"
                    value={param.name}
                    onChange={(evt) =>
                        setParam({
                            ...param,
                            name: evt.target.value,
                        })
                    }
                />
                
            </Form.Item>
            <Form.Item>
                <UserSelect 
                    defaultOptionName="负责人"
                    value={param.personId} 
                    onChange={(value:number | undefined)=>
                        setParam({
                            ...param,
                            personId: value 
                        })}/>
                
            </Form.Item>
        </Form>
    );
};

