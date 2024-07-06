
export const convertNumber = (number, toFixed = 1) => {
    if (!number) return '0'

    const thousand = 1000
    const million = 1000000

    if (number >= million || number <= -million) {
        return `${(number / million).toFixed(toFixed)}M`
    }

    if (number >= thousand || number <= -thousand) {
        return `${(number / thousand).toFixed(toFixed)}K`
    }

    return Number(number).toFixed(0)
}

export const convertDistance = num => {
    if (num < 1000) return '<1km'
    return `${(num / 1000).toFixed(0)}km`
}

export const makePercentage = (num, toFixed = 1) => {
    if (!num) return '0%'
    return `${(num * 100).toFixed(toFixed) / 1}%`
}
