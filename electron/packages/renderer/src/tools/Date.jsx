import moment from 'moment'

const displayDate = (d) => {
    if (!d)
        return 'Unknown'

    const today = moment()
    const date = moment(d)

    if (today.diff(date, 'days') > 0)
        return moment(d).format('h:mm A')

    return moment(d).format('MM/DD/YY, h:mm A')
}

export {
    displayDate
}