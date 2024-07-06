import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(updateLocale)
dayjs.extend(relativeTime, {
    thresholds: [
        { l: 's', r: 1 },
        { l: 'm', r: 1 },
        { l: 'mm', r: 59, d: 'minute' },
        { l: 'h', r: 1 },
        { l: 'hh', r: 23, d: 'hour' },
        { l: 'd', r: 1 },
        { l: 'dd', r: 29, d: 'day' },
        { l: 'M', r: 1 },
        { l: 'MM', r: 11, d: 'month' },
        { l: 'y' },
        { l: 'yy', d: 'year' },
    ],
})

export const convertDate = (value) => {
    if (!value) return null
    const newDate = new Date(value)
    // const options1 = {
    //     year: 'numeric',
    //     month: 'short',
    //     day: 'numeric',
    // }
    // const options2 = {
    //     month: 'short',
    //     day: 'numeric',
    // }

    return (
        newDate.getFullYear() === 2021
            ? dayjs(newDate).format('D MMM')
            : dayjs(newDate).format('MM-YY')
    )
}

export const convertDuration = (duration) => {
    const secNum = parseInt(duration, 10)
    let hours = Math.floor(secNum / 3600)
    let minutes = Math.floor((secNum - (hours * 3600)) / 60)
    let seconds = secNum - (hours * 3600) - (minutes * 60)

    if (hours < 10) {
        hours = 0 + hours
    }
    if (minutes < 10) {
        minutes = 0 + minutes
    }
    if (seconds < 10) {
        seconds = 0 + seconds
    }
    return minutes + 'm ' + seconds + 's'
}

export const convertTimeFromNow = (timestamp) => {
    dayjs.updateLocale('en', {
        relativeTime: {
            future: 'in %s',
            past: '%s',
            s: '%ds',
            ss: '%ds',
            m: '%dm',
            mm: '%dm',
            h: '%dh',
            hh: '%dh',
            d: '%dd',
            dd: '%dd',
            M: '%dmo',
            MM: '%dmo',
            y: '%dyr',
            yy: '%dyrs',
        },
    })

    return dayjs(timestamp).fromNow()
}

export const dateInfo = (date) => {
    return {
        date: dayjs(date).format('YYYY-MM-DD'),
        time: dayjs(date).format('HH:mm'),
        isYesterday: dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day'),
        isToday: dayjs(date).isSame(dayjs(), 'day'),
    }
}
