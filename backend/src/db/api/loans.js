
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class LoansDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const loans = await db.loans.create(
            {
                id: data.id || undefined,

        amount: data.amount
        ||
        null
            ,

        purpose: data.purpose
        ||
        null
            ,

        application_date: data.application_date
        ||
        null
            ,

        repayment_date: data.repayment_date
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return loans;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const loansData = data.map((item, index) => ({
                id: item.id || undefined,

                amount: item.amount
            ||
            null
            ,

                purpose: item.purpose
            ||
            null
            ,

                application_date: item.application_date
            ||
            null
            ,

                repayment_date: item.repayment_date
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const loans = await db.loans.bulkCreate(loansData, { transaction });

        return loans;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const loans = await db.loans.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.amount !== undefined) updatePayload.amount = data.amount;

        if (data.purpose !== undefined) updatePayload.purpose = data.purpose;

        if (data.application_date !== undefined) updatePayload.application_date = data.application_date;

        if (data.repayment_date !== undefined) updatePayload.repayment_date = data.repayment_date;

        if (data.status !== undefined) updatePayload.status = data.status;

        updatePayload.updatedById = currentUser.id;

        await loans.update(updatePayload, {transaction});

        return loans;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const loans = await db.loans.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of loans) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of loans) {
                await record.destroy({transaction});
            }
        });

        return loans;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const loans = await db.loans.findByPk(id, options);

        await loans.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await loans.destroy({
            transaction
        });

        return loans;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const loans = await db.loans.findOne(
            { where },
            { transaction },
        );

        if (!loans) {
            return loans;
        }

        const output = loans.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.purpose) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'loans',
                            'purpose',
                            filter.purpose,
                        ),
                    };
                }

            if (filter.amountRange) {
                const [start, end] = filter.amountRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    amount: {
                    ...where.amount,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    amount: {
                    ...where.amount,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.application_dateRange) {
                const [start, end] = filter.application_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    application_date: {
                    ...where.application_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    application_date: {
                    ...where.application_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.repayment_dateRange) {
                const [start, end] = filter.repayment_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    repayment_date: {
                    ...where.repayment_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    repayment_date: {
                    ...where.repayment_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.loans.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'loans',
                        'amount',
                        query,
                    ),
                ],
            };
        }

        const records = await db.loans.findAll({
            attributes: [ 'id', 'amount' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['amount', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.amount,
        }));
    }

};

