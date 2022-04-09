import {query} from 'express-validator';

/**
 * Checks if the 'from' date is before the 'to' date
 */
const fromDateBeforeToDate = {
    fromDateBeforeToDate: query(['from'])
        .trim()
        .optional()
        .custom((from, meta) => {
            const to = meta.req.query.to;
            const fromAsDate = new Date(from);
            const toAsDate = new Date(to);

            if (!fromAsDate && !toAsDate || from === '' && to === '') {
                delete meta.req.query.to;
                delete meta.req.query.from;
                return true;
            }

            if (isNaN(fromAsDate.getMilliseconds())) {
                throw new Error('The "from" date should be a valid date');
            }

            if (!fromAsDate || !toAsDate || fromAsDate >= toAsDate) {
                throw new Error('The "from" date should be before the "to" date');
            }

            return true;
        })
};

export {fromDateBeforeToDate};
