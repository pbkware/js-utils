import { Config, Decimal, Numeric } from 'decimal.js-light';

/** @public */
export interface DecimalFactory {
    readonly nullDecimal: Decimal;

    newDecimal(value: Numeric): Decimal;
    newUndefinableDecimal(value: Numeric | undefined): Decimal | undefined;
    newUndefinableNullableDecimal(value: Numeric | undefined | null): Decimal | null | undefined;
    cloneDecimal(config: Config): DecimalConstructor;
}

/** @public */
export type DecimalConstructor = new (numeric: Numeric) => Decimal;

