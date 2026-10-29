import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Epic } from '../types/epic';
import { useHttp } from './http';

export const useEpics = (projectId: number) => {
    const client = useHttp();

    return useQuery<Epic[], Error>(
        ['epics', { projectId }],
        () => client(['epics', { data: { projectId } }]),
        { enabled: !!projectId },
    );
};

export const useAddEpic = () => {
    const client = useHttp();
    const queryClient = useQueryClient();

    return useMutation<Epic, Error, Pick<Epic, 'name' | 'projectId'>>(
        (epic) => client(['epics', { method: 'POST', data: epic }]),
        { onSuccess: () => queryClient.invalidateQueries(['epics']) },
    );
};

export const useDeleteEpic = () => {
    const client = useHttp();
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, { id: number }>(
        ({ id }) => client([`epics/${id}`, { method: 'DELETE' }]),
        { onSuccess: () => queryClient.invalidateQueries(['epics']) },
    );
};
