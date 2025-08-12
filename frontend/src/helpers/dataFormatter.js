import dayjs from 'dayjs';
import _ from 'lodash';

export default {
    filesFormatter(arr) {
        if (!arr || !arr.length) return [];
        return arr.map((item) => item);
    },
    imageFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            publicUrl: item.publicUrl || ''
        }))
    },
    oneImageFormatter(arr) {
        if (!arr || !arr.length) return ''
        return arr[0].publicUrl || ''
    },
    dateFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD')
    },
    dateTimeFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    booleanFormatter(val) {
        return val ? 'Yes' : 'No'
    },
    dataGridEditFormatter(obj) {
        return _.transform(obj, (result, value, key) => {
            if (_.isArray(value)) {
                result[key] = _.map(value, 'id');
            } else if (_.isObject(value)) {
                result[key] = value.id;
            } else {
                result[key] = value;
            }
        });
    },

        usersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.firstName)
        },
        usersOneListFormatter(val) {
            if (!val) return ''
            return val.firstName
        },
        usersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.firstName}
            });
        },
        usersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.firstName, id: val.id}
        },

        contributionsManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.amount)
        },
        contributionsOneListFormatter(val) {
            if (!val) return ''
            return val.amount
        },
        contributionsManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.amount}
            });
        },
        contributionsOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.amount, id: val.id}
        },

        loansManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.amount)
        },
        loansOneListFormatter(val) {
            if (!val) return ''
            return val.amount
        },
        loansManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.amount}
            });
        },
        loansOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.amount, id: val.id}
        },

        membersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.first_name)
        },
        membersOneListFormatter(val) {
            if (!val) return ''
            return val.first_name
        },
        membersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.first_name}
            });
        },
        membersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.first_name, id: val.id}
        },

}
