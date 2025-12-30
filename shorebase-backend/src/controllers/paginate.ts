export interface PaginatedQuery {
    take?: number;
    skip?: number;
    page?: number;
}

export default function paginate(query: PaginatedQuery) {
    let take = query.take || 100;
    let page = query.page || 1;
    let skip = query.skip || 0;
    if (page) {
        skip = (page - 1) * skip;
    }

    return { take, skip };
}
