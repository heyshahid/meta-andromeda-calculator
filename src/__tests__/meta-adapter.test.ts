import { describe, it, expect, beforeEach } from "vitest";
import { MetaMarketingAdapter } from "../lib/integrations/meta-adapter";

describe("Meta Marketing API Adapter Tests", () => {
  it("generates official Meta OAuth URL with ads_read scope", () => {
    const url = MetaMarketingAdapter.getOAuthUrl("123456789", "http://localhost:3000/callback", "csrf_test_state");
    expect(url).toContain("https://www.facebook.com/v21.0/dialog/oauth");
    expect(url).toContain("client_id=123456789");
    expect(url).toContain("ads_read%2Cread_insights");
    expect(url).toContain("state=csrf_test_state");
  });

  it("parses x-business-use-case-usage rate limit header correctly", () => {
    const headerStr = JSON.stringify({
      "act_987654": [
        {
          "type": "ads_insights",
          "call_count": 42,
          "total_cputime": 18,
          "total_time": 10,
          "estimated_time_to_regain_access": 0
        }
      ]
    });

    const usage = MetaMarketingAdapter.parseRateLimitHeader(headerStr);
    expect(usage).toBe(42);
  });

  it("returns 0 for empty or invalid rate limit headers", () => {
    expect(MetaMarketingAdapter.parseRateLimitHeader("")).toBe(0);
    expect(MetaMarketingAdapter.parseRateLimitHeader("invalid-json")).toBe(0);
  });

  it("transforms raw Graph API insights response into Open MarketingOps Campaign schema", () => {
    const rawGraphInsights = [
      {
        campaign_id: "cmp_meta_001",
        campaign_name: "Advantage+ Shopping Q4",
        account_name: "Shahid Media Lab",
        spend: "1500.00",
        impressions: "65000",
        clicks: "1950",
        actions: [
          { action_type: "link_click", value: "1950" },
          { action_type: "purchase", value: "75" }
        ],
        action_values: [
          { action_type: "purchase", value: "6750.00" }
        ]
      }
    ];

    const campaigns = MetaMarketingAdapter.transformInsightsToCampaigns(rawGraphInsights);
    expect(campaigns.length).toBe(1);

    const c = campaigns[0];
    expect(c.id).toBe("meta-cmp_meta_001");
    expect(c.name).toBe("Advantage+ Shopping Q4");
    expect(c.platform).toBe("Meta Ads");
    expect(c.spend).toBe(1500.00);
    expect(c.revenue).toBe(6750.00);
    expect(c.conversions).toBe(75);
    expect(c.roas).toBe(4.5); // 6750 / 1500
    expect(c.cpa).toBe(20); // 1500 / 75
    expect(c.ctr).toBe(3); // (1950 / 65000) * 100
  });

  it("safely handles zero conversions in Graph API responses", () => {
    const rawZeroConv = [
      {
        campaign_id: "cmp_meta_002",
        campaign_name: "Awareness Video Reach",
        spend: "200.00",
        impressions: "30000",
        clicks: "400",
        actions: [],
        action_values: []
      }
    ];

    const campaigns = MetaMarketingAdapter.transformInsightsToCampaigns(rawZeroConv);
    expect(campaigns[0].conversions).toBe(0);
    expect(campaigns[0].revenue).toBe(0);
    expect(campaigns[0].roas).toBe(0);
    expect(campaigns[0].cpa).toBe(0);
  });
});

