export default {
    convertToDecimals (amount: number, decimals: number = 18): number
    {
        return Math.floor(Number(amount * (10 ** decimals)));
    },
    convertFromDecimals (amount: number, decimals: number = 18): number
    {
        const parsed = parseFloat(String(amount / (10 ** decimals))).toFixed(decimals);
        return Number(parsed);
    },
};
