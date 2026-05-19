import { List, Popover, Typography,Divider } from "antd";
import React from "react";
import { useProjects } from "../utils/project";
import styled from "@emotion/styled";
import { ButtonNoPadding } from "./lib";

export const ProjectPopover = ({ children, projectButton }: { children: React.ReactNode; projectButton: React.ReactNode }) => {
    const { data: projects } = useProjects();
    const pinnedProjects = projects?.filter((project) => project.pin) ?? [];
    const content=<ContentContainer>
        <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
        <List>
            {
                pinnedProjects.map((project) => (
                    <List.Item key={project.id}>
                        <List.Item.Meta title={project.name} />
                    </List.Item>
                ))
            }
        </List>
        <Divider/>
        {projectButton}
    </ContentContainer>
    return <Popover placement="bottom" content={content}>{children}</Popover>
}

const ContentContainer= styled.div`
    min-width:30rem
`