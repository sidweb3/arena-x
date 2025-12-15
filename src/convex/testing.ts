import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const testDuelFlow = action({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("Starting test duel flow...");

    // 1. Create a duel (simulating the sync from Linera)
    const duelId = await ctx.runMutation(api.duels.createDuel, {
      type: "agent_vs_agent",
      participants: [
        { id: "agent1", type: "agent", name: "Mock Agent 1" },
        { id: "agent2", type: "agent", name: "Mock Agent 2" }
      ],
      marketEvent: "BTC > 70000"
    });
    console.log("Created duel:", duelId);

    // 2. Place a bet
    // We need a user with balance first, so let's ensure a mock user exists
    const mockWallet = "linera:mock_tester";
    await ctx.runMutation(api.users.storeUser, {
      walletAddress: mockWallet,
      name: "Mock Tester"
    });

    await ctx.runMutation(api.duels.placeBet, {
      duelId,
      bettorWallet: mockWallet,
      amount: 50,
      prediction: "agent1"
    });
    console.log("Placed bet on duel:", duelId);
    
    return { success: true, duelId, message: "Test flow completed successfully" };
  }
});
