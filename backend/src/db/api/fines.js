
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class FinesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const fines = await db.fines.create(
            {
                id: data.id || undefined,

        amount: data.amount
        ||
        null
            ,

        reason: data.reason
        ||
        null
            ,

        date: data.date
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return fines;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const finesData = data.map((item, index) => ({
                id: item.id || undefined,

                amount: item.amount
            ||
            null
            ,

                reason: item.reason
            ||
            null
            ,

                date: item.date
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const fines = await db.fines.bulkCreate(finesData, { transaction });

        return fines;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const fines = await db.fines.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.amount !== undefined) updatePayload.amount = data.amount;

        if (data.reason !== undefined) updatePayload.reason = data.reason;

        if (data.date !== undefined) updatePayload.date = data.date;

        updatePayload.updatedById = currentUser.id;

        await fines.update(updatePayload, {transaction});

        return fines;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const fines = await db.fines.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of fines) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of fines) {
                await record.destroy({transaction});
            }
        });

        return fines;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const fines = await db.fines.findByPk(id, options);

        await fines.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await fines.destroy({
            transaction
        });

        return fines;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const fines = await db.fines.findOne(
            { where },
            { transaction },
        );

        if (!fines) {
            return fines;
        }

        const output = fines.get({plain: true});

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

                if (filter.reason) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'fines',
                            'reason',
                            filter.reason,
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

            if (filter.dateRange) {
                const [start, end] = filter.dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    date: {
                    ...where.date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    date: {
                    ...where.date,
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
            const { rows, count } = await db.fines.findAndCountAll(queryOptions);

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
                        'fines',
                        'amount',
                        query,
                    ),
                ],
            };
        }

        const records = await db.fines.findAll({
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

