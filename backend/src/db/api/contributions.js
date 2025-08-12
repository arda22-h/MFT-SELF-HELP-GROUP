
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ContributionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const contributions = await db.contributions.create(
            {
                id: data.id || undefined,

        amount: data.amount
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

        return contributions;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const contributionsData = data.map((item, index) => ({
                id: item.id || undefined,

                amount: item.amount
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
        const contributions = await db.contributions.bulkCreate(contributionsData, { transaction });

        return contributions;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const contributions = await db.contributions.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.amount !== undefined) updatePayload.amount = data.amount;

        if (data.date !== undefined) updatePayload.date = data.date;

        updatePayload.updatedById = currentUser.id;

        await contributions.update(updatePayload, {transaction});

        return contributions;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const contributions = await db.contributions.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of contributions) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of contributions) {
                await record.destroy({transaction});
            }
        });

        return contributions;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const contributions = await db.contributions.findByPk(id, options);

        await contributions.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await contributions.destroy({
            transaction
        });

        return contributions;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const contributions = await db.contributions.findOne(
            { where },
            { transaction },
        );

        if (!contributions) {
            return contributions;
        }

        const output = contributions.get({plain: true});

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
            const { rows, count } = await db.contributions.findAndCountAll(queryOptions);

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
                        'contributions',
                        'amount',
                        query,
                    ),
                ],
            };
        }

        const records = await db.contributions.findAll({
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

