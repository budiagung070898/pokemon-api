export const PAGE_SIZE = 20;

export const getOffset = (page: number) => Math.max(0, (page - 1) * PAGE_SIZE);
