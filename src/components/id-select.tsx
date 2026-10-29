// 引入 React，用于 JSX 与类型推断。
import React from "react";
// 引入 Ant Design 的 Select 组件作为基础下拉框。
import { Select } from "antd";

// 推导 Select 的完整属性类型，后续做裁剪复用。
type SelectProps = React.ComponentProps<typeof Select>;

// 定义 IdSelect 的属性：覆盖 value/options/onChange 为业务友好类型。
interface IdSelectProps extends Omit<SelectProps, "value" | "options" | "onChange"> {
    // 当前值允许 string/number/null/undefined，便于兼容 URL 参数与受控输入。
    value?: string | number | null | undefined;
    // 对外统一回调 number 或 undefined。
    onChange?: (value?: number) => void;
    // 可选的默认占位选项名称。
    defaultOptionName?: string;
    // 下拉项结构，使用 name/id 映射展示与取值。
    options?: { name: string; id: number }[];
}

// 统一的 ID 选择器组件。
export const IdSelect = (props: IdSelectProps) => {
    // 解构常用字段，剩余属性透传到底层 Select。
    const { value, onChange, defaultOptionName, options, ...restProps } = props;
    // 返回 Select，并在内部做数值转换。
    return <Select
        // 将外部 value 统一转成 number，避免类型不一致。
        value={options?.length ? toNumber(value):0}
        // 变更时同样转成 number，0 视为未选择并回传 undefined。
        onChange={value => onChange?.(toNumber(value) || undefined)}
        // 透传其余属性，例如 disabled、style 等。
        {...restProps}
    >
        {/* 如果传入 defaultOptionName，则插入 value=0 的默认选项。 */}
        {
            defaultOptionName && <Select.Option value={0}>{defaultOptionName}</Select.Option>
        }
        {/* 渲染业务传入选项列表。 */}
        {
            options?.map(option => <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>)
        }
    </Select>;
};

// 将任意值安全转换为 number，无法转换时返回 0。
const toNumber = (value: unknown) => isNaN(Number(value)) ? 0 : Number(value);

 