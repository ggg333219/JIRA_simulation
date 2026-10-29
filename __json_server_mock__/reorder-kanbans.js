const reorderKanbans = (columns, { fromId, referenceId, type }) => {
    if (!Number.isInteger(fromId) || !Number.isInteger(referenceId) ||
        fromId === referenceId || !['before', 'after'].includes(type)) {
        throw new Error('无效的看板列排序参数');
    }

    const moving = columns.find(({ id }) => id === fromId);
    const reference = columns.find(({ id }) => id === referenceId);
    if (!moving || !reference || moving.projectId !== reference.projectId) {
        throw new Error('看板列不存在或不属于同一项目');
    }

    const projectColumns = columns.filter(({ projectId }) => projectId === moving.projectId);
    const reordered = projectColumns.filter(({ id }) => id !== fromId);
    const referenceIndex = reordered.findIndex(({ id }) => id === referenceId);
    reordered.splice(referenceIndex + (type === 'after' ? 1 : 0), 0, moving);

    let nextIndex = 0;
    const updatedColumns = columns.map((column) =>
        column.projectId === moving.projectId ? reordered[nextIndex++] : column,
    );
    return { updatedColumns, projectColumns: reordered };
};

module.exports = { reorderKanbans };
