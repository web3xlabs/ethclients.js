import utils from "@ethclients/utils";
import each from "jest-each";

each([
    [1.5, 18, 1500000000000000000],
    [10.32, 9, 10320000000],
    [420.69, 10, 4206900000000],
    [12.43951823, 18, 12439518229999999000],
    [0.30439130231, 9, 304391302],
]).test ('convert to decimals', (amount: number, decimals: number, expected: number) => {
    const result = utils.convertToDecimals(amount, decimals);
    expect(result).toEqual(expected);
});

each([
    [1500000000000000000, 18, 1.5],
    [304391302, 9, 0.304391302],
    [78317527736661110, 18, 0.0783175277366611],
    [100000, 10, 0.00001],
    [98888811777, 9, 98.888811777],
]).test('convert from decimals', (amount: number, decimals: number, expected: number) => {
    const result = utils.convertFromDecimals(amount, decimals);
    expect(result).toEqual(expected);
});