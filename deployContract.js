require("dotenv").config();
const {
    Client,
    PrivateKey,
    AccountId,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

async function main() {
    try {
        console.log("✅ Connecting to Hedera Testnet...");

        const operatorId = process.env.OPERATOR_ID;
        const operatorKey = process.env.OPERATOR_KEY;

        if (!operatorId || !operatorKey) {
            throw new Error("❌ Missing OPERATOR_ID or OPERATOR_KEY in .env file");
        }

        const accountId = AccountId.fromString(operatorId);
        const privateKey = PrivateKey.fromStringECDSA(operatorKey);

        const client = Client.forTestnet().setOperator(accountId, privateKey);
        console.log("✅ Connected to Hedera Testnet");

        const bytecode = fs.readFileSync("Contract_sol_Contract.bin");

        console.log("📤 Uploading contract bytecode...");
        const fileCreateTx = new FileCreateTransaction()
            .setKeys([privateKey.publicKey])
            .setContents(bytecode)
            .setMaxTransactionFee(new Hbar(2))
            .freezeWith(client);

        const fileCreateSign = await fileCreateTx.sign(privateKey);
        const fileCreateSubmit = await fileCreateSign.execute(client);
        const fileCreateRx = await fileCreateSubmit.getReceipt(client);
        const bytecodeFileId = fileCreateRx.fileId;

        if (!bytecodeFileId) throw new Error("❌ Failed to upload bytecode");

        console.log(`✅ Bytecode File ID: ${bytecodeFileId.toString()}`);

        console.log("🚀 Deploying contract...");
        const contractTx = new ContractCreateTransaction()
            .setBytecodeFileId(bytecodeFileId)
            .setGas(100000)
            .setConstructorParameters(new ContractFunctionParameters())
            .setMaxTransactionFee(new Hbar(5));

        const contractSubmit = await contractTx.execute(client);
        const contractRx = await contractSubmit.getReceipt(client);

        if (contractRx.status.toString() !== "SUCCESS") {
            throw new Error(`❌ Contract deployment failed: ${contractRx.status.toString()}`);
        }

        const contractId = contractRx.contractId;
        console.log(`🎉 Contract deployed successfully! Contract ID: ${contractId}`);

    } catch (error) {
        console.error("❌ Deployment failed:", error);
    }
}

main();