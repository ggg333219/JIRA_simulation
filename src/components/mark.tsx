import React from 'react';

export const Mark = ({ name, keyword }: { name: string; keyword?: string }) => {
    if (!keyword) return <>{name}</>;

    const lowerName = name.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const fragments: React.ReactNode[] = [];
    let start = 0;
    let matchIndex = lowerName.indexOf(lowerKeyword, start);

    while (matchIndex !== -1) {
        fragments.push(name.slice(start, matchIndex));
        fragments.push(<mark key={matchIndex}>{name.slice(matchIndex, matchIndex + keyword.length)}</mark>);
        start = matchIndex + keyword.length;
        matchIndex = lowerName.indexOf(lowerKeyword, start);
    }

    fragments.push(name.slice(start));
    return <>{fragments}</>;
};
