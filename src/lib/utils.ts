export function parseDuration(durationStr: string): number | undefined {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) return;

    if (match.length !== 3) return;
    
    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 1000 * 60;
        case "h":
            return value * 1000 * 60 * 60;
        default:
            return;
    }
}
