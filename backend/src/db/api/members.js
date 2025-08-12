
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MembersDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const members = await db.members.create(
            {
                id: data.id || undefined,

        first_name: data.first_name
        ||
        null
            ,

        last_name: data.last_name
        ||
        null
            ,

        email: data.email
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

        return members;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const membersData = data.map((item, index) => ({
                id: item.id || undefined,

                first_name: item.first_name
            ||
            null
            ,

                last_name: item.last_name
            ||
            null
            ,

                email: item.email
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
        const members = await db.members.bulkCreate(membersData, { transaction });

        return members;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const members = await db.members.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.first_name !== undefined) updatePayload.first_name = data.first_name;

        if (data.last_name !== undefined) updatePayload.last_name = data.last_name;

        if (data.email !== undefined) updatePayload.email = data.email;

        if (data.status !== undefined) updatePayload.status = data.status;

        updatePayload.updatedById = currentUser.id;

        await members.update(updatePayload, {transaction});

        return members;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const members = await db.members.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of members) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of members) {
                await record.destroy({transaction});
            }
        });

        return members;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const members = await db.members.findByPk(id, options);

        await members.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await members.destroy({
            transaction
        });

        return members;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const members = await db.members.findOne(
            { where },
            { transaction },
        );

        if (!members) {
            return members;
        }

        const output = members.get({plain: true});

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

                if (filter.first_name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'members',
                            'first_name',
                            filter.first_name,
                        ),
                    };
                }

                if (filter.last_name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'members',
                            'last_name',
                            filter.last_name,
                        ),
                    };
                }

                if (filter.email) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'members',
                            'email',
                            filter.email,
                        ),
                    };
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
            const { rows, count } = await db.members.findAndCountAll(queryOptions);

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
                        'members',
                        'first_name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.members.findAll({
            attributes: [ 'id', 'first_name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['first_name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.first_name,
        }));
    }

};

