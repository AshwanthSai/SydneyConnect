import moment from "moment"

export const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm')
        /* 
            Instead of plain JS Date with lot of boilerplate
            const time = now.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                minute: '2-digit',
                hour12: true 
            });
        */
    }
}