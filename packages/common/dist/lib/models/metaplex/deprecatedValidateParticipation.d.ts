import { TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey } from '../../utils';
export declare function deprecatedValidateParticipation(auctionManager: StringPublicKey, openEditionMetadata: StringPublicKey, openEditionMasterAccount: StringPublicKey, printingAuthorizationHoldingAccount: StringPublicKey, auctionManagerAuthority: StringPublicKey, whitelistedCreatorEntry: StringPublicKey | undefined, store: StringPublicKey, safetyDepositBox: StringPublicKey, safetyDepositBoxTokenStore: StringPublicKey, vault: StringPublicKey, instructions: TransactionInstruction[]): Promise<void>;
//# sourceMappingURL=deprecatedValidateParticipation.d.ts.map