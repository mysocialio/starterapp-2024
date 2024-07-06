export const isEmptyString = (text) => /^\s*$/.test(text)

export const relaceWhiteSpace = (text) => text?.replace(/\s/g, '') || ''

export const capitalizeString = (s) => (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || ''

export const capitalizeEveryWord = (s) => (s?.split(' ').map(i => capitalizeString(i)).join(' ')) || ''

// eslint-disable-next-line
export const cleanupUsername = (s) => s?.replace(/[^a-zA-Z0-9\-_\.]+/, '') || ''

// split vals
const splitter = (val) => val?.split(' ') || []

// Utility to parse & replace a target word with another word
export const parseAndReplaceString = (text, targetValue, replaceValue) => {
    // check if text has new line breaks
    const newLines = text.split('\n\n')
    const hasNewLines = newLines.length > 0

    if (hasNewLines) {
        const withNewLines = newLines
            .map(item => splitter(item).map(part => part.includes(`${targetValue}`)
                ? `${replaceValue}`
                : part)
                .join(' '))
            .join('\n\n')
        return withNewLines
    } else {
        const withoutNewLines = splitter(' ')
        const words = withoutNewLines
            .map(item => item.includes(`${targetValue}`)
                ? `${replaceValue})`
                : item)
            .join(' ')
        return words
    }
}
