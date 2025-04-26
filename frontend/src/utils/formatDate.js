export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        
    });
}

export function formatMessageDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}