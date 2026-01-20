import { ClobClient } from '@polymarket/clob-client';
import { UserActivityInterface } from '../interfaces/User';
import { ENV } from '../config/env';
import { getUserActivityModel } from '../models/userHistory';
import Logger from '../utils/logger';

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const {
    USER_ADDRESSES,
} = ENV;

/* -------------------------------------------------------------------------- */
/*                                   MODELS                                   */
/* -------------------------------------------------------------------------- */

const userActivityModels = USER_ADDRESSES.map(address => ({
    address,
    model: getUserActivityModel(address),
}));

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface TradeWithUser extends UserActivityInterface {
    userAddress: string;
}

/* -------------------------------------------------------------------------- */
/*                               DB READ HELPERS                               */
/* -------------------------------------------------------------------------- */

export const readTempTrades = async (): Promise<TradeWithUser[]> => {
    const results: TradeWithUser[] = [];

    for (const { address, model } of userActivityModels) {
        const trades = await model.find({
            type: 'TRADE',
            bot: false,
            botExcutedTime: 0,
        });

        results.push(
            ...trades.map(t => ({
                ...(t.toObject() as UserActivityInterface),
                userAddress: address,
            }))
        );
    }

    return results;
};

/* -------------------------------------------------------------------------- */
/*                              PLACEHOLDER EXPORT                             */
/* -------------------------------------------------------------------------- */

/**
 * Intentionally empty.
 * Main trading / aggregation / execution logic removed.
 */
const tradeExecutor = async (_clobClient?: ClobClient) => {
    Logger.info('Trade executor logic removed');
};

export default tradeExecutor;
