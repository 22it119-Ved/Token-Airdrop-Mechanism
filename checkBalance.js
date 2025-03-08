require("dotenv").config();
const { Client, AccountBalanceQuery, AccountId, PrivateKey } = require("@hashgraph/sdk");

async function main() {
    try {
        console.log("✅ Checking Account Balance...");

        const operatorId = process.env.OPERATOR_ID;
        const operatorKey = process.env.OPERATOR_KEY;

        if (!operatorId || !operatorKey) {
            throw new Error("❌ Missing OPERATOR_ID or OPERATOR_KEY in .env file");
        }

        const accountId = AccountId.fromString(operatorId);
        const privateKey = PrivateKey.fromStringECDSA(operatorKey);

        const client = Client.forTestnet().setOperator(accountId, privateKey);

        const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
        const balance = await balanceQuery.execute(client);
        console.log(`💰 Account Balance: ${balance.hbars.toString()} HBAR`);

    } catch (error) {
        console.error("❌ Error checking balance:", error);
    }
}

main();