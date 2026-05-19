import { useUrlQueryParam } from "../../utils/url";
import { useMemo } from "react";
type ProjectSearchParams = {
    name?: string;
    personId?: number;
};

export const useProjectsSearchParams = () => {
    const [param, setParam] = useUrlQueryParam(["name", "personId"]);
    return [
        useMemo(() => ({
            ...param,
            personId: param.personId ? Number(param.personId) : undefined,
        }) as Partial<ProjectSearchParams>, [param]),
        setParam,
    ] as const;
};

