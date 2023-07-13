class BaseDAL {
    getPaginatedFilteredSorted = (query, filters, sort, limit, page) => {
        if(filters?.length) {
            query.where(Object.assign({}, ...filters));        
        }

        if(sort?.length) {
            query.orderBy(...sort);
        }

        const offset = (page - 1) * limit
        return query.offset(offset).limit(limit);
    }
}

export default BaseDAL;