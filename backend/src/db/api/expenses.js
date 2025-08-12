
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ExpensesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const expenses = await db.expenses.create(
            {
                id: data.id || undefined,

        amount: data.amount
        ||
        null
            ,

        description: data.description
        ||
        null
            ,

        date: data.date
        ||
        null
            ,

        category: data.category
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return expenses;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const expensesData = data.map((item, index) => ({
                id: item.id || undefined,

                amount: item.amount
            ||
            null
            ,

                description: item.description
            ||
            null
            ,

                date: item.date
            ||
            null
            ,

                category: item.category
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const expenses = await db.expenses.bulkCreate(expensesData, { transaction });

        return expenses;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const expenses = await db.expenses.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.amount !== undefined) updatePayload.amount = data.amount;

        if (data.description !== undefined) updatePayload.description = data.description;

        if (data.date !== undefined) updatePayload.date = data.date;

        if (data.category !== undefined) updatePayload.category = data.category;

        updatePayload.updatedById = currentUser.id;

        await expenses.update(updatePayload, {transaction});

        return expenses;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const expenses = await db.expenses.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of expenses) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of expenses) {
                await record.destroy({transaction});
            }
        });

        return expenses;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const expenses = await db.expenses.findByPk(id, options);

        await expenses.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await expenses.destroy({
            transaction
        });

        return expenses;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const expenses = await db.expenses.findOne(
            { where },
            { transaction },
        );

        if (!expenses) {
            return expenses;
        }

        const output = expenses.get({plain: true});

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

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'expenses',
                            'description',
                            filter.description,
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

            if (filter.category) {
                where = {
                    ...where,
                category: filter.category,
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
            const { rows, count } = await db.expenses.findAndCountAll(queryOptions);

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
                        'expenses',
                        'description',
                        query,
                    ),
                ],
            };
        }

        const records = await db.expenses.findAll({
            attributes: [ 'id', 'description' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['description', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.description,
        }));
    }

};

