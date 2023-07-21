class BaseContoller {
    getDefaultQueryOptions = (req) => {
        const {
            filters = [],
            sort = [],
            limit = 10,
            page = 1,
        } = req.query;

        return {filters, sort, limit, page};
    }
}

export default BaseContoller;