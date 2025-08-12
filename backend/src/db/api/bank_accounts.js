
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Bank_accountsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const bank_accounts = await db.bank_accounts.create(
            {
                id: data.id || undefined,

        account_name: data.account_name
        ||
        null
            ,

        account_number: data.account_number
        ||
        null
            ,

        balance: data.balance
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return bank_accounts;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const bank_accountsData = data.map((item, index) => ({
                id: item.id || undefined,

                account_name: item.account_name
            ||
            null
            ,

                account_number: item.account_number
            ||
            null
            ,

                balance: item.balance
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const bank_accounts = await db.bank_accounts.bulkCreate(bank_accountsData, { transaction });

        return bank_accounts;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const bank_accounts = await db.bank_accounts.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.account_name !== undefined) updatePayload.account_name = data.account_name;

        if (data.account_number !== undefined) updatePayload.account_number = data.account_number;

        if (data.balance !== undefined) updatePayload.balance = data.balance;

        updatePayload.updatedById = currentUser.id;

        await bank_accounts.update(updatePayload, {transaction});

        return bank_accounts;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const bank_accounts = await db.bank_accounts.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of bank_accounts) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of bank_accounts) {
                await record.destroy({transaction});
            }
        });

        return bank_accounts;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const bank_accounts = await db.bank_accounts.findByPk(id, options);

        await bank_accounts.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await bank_accounts.destroy({
            transaction
        });

        return bank_accounts;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const bank_accounts = await db.bank_accounts.findOne(
            { where },
            { transaction },
        );

        if (!bank_accounts) {
            return bank_accounts;
        }

        const output = bank_accounts.get({plain: true});

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

                if (filter.account_name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'bank_accounts',
                            'account_name',
                            filter.account_name,
                        ),
                    };
                }

                if (filter.account_number) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'bank_accounts',
                            'account_number',
                            filter.account_number,
                        ),
                    };
                }

            if (filter.balanceRange) {
                const [start, end] = filter.balanceRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    balance: {
                    ...where.balance,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    balance: {
                    ...where.balance,
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
            const { rows, count } = await db.bank_accounts.findAndCountAll(queryOptions);

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
                        'bank_accounts',
                        'account_name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.bank_accounts.findAll({
            attributes: [ 'id', 'account_name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['account_name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.account_name,
        }));
    }

};

