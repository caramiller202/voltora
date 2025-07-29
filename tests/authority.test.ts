import { describe, it, expect, beforeEach } from "vitest";

// Mock of the Voltora Verified Energy Provider Registry
const mockContract = {
  admin: "ST1ADMIN00000000000000000000000000000000",
  verifiedProviders: new Map<string, boolean>(),
  providerMetadata: new Map<string, { name: string; region: string; type: string }>(),

  isAdmin(caller: string) {
    return caller === this.admin;
  },

  registerProvider(
    caller: string,
    provider: string,
    name: string,
    region: string,
    type: string
  ) {
    if (!this.isAdmin(caller)) return { error: 100 }; // ERR-NOT-AUTHORIZED
    if (!name) return { error: 103 }; // ERR-NAME-EMPTY
    if (!region) return { error: 104 }; // ERR-REGION-EMPTY
    if (!type) return { error: 105 }; // ERR-TYPE-EMPTY
    if (this.verifiedProviders.has(provider)) return { error: 101 }; // ERR-ALREADY-VERIFIED

    this.verifiedProviders.set(provider, true);
    this.providerMetadata.set(provider, { name, region, type });
    return { value: true };
  },

  removeProvider(caller: string, provider: string) {
    if (!this.isAdmin(caller)) return { error: 100 }; // ERR-NOT-AUTHORIZED
    if (!this.verifiedProviders.has(provider)) return { error: 102 }; // ERR-NOT-FOUND

    this.verifiedProviders.delete(provider);
    this.providerMetadata.delete(provider);
    return { value: true };
  },

  isVerifiedProvider(provider: string) {
    return this.verifiedProviders.has(provider);
  },

  getProviderMetadata(provider: string) {
    const metadata = this.providerMetadata.get(provider);
    return metadata ? { value: metadata } : { error: 102 }; // ERR-NOT-FOUND
  },

  updateProviderMetadata(
    caller: string,
    provider: string,
    name: string,
    region: string,
    type: string
  ) {
    if (!this.isAdmin(caller)) return { error: 100 };
    if (!this.verifiedProviders.has(provider)) return { error: 102 };

    this.providerMetadata.set(provider, { name, region, type });
    return { value: true };
  },

  bulkVerify(caller: string, providers: string[]) {
    if (!this.isAdmin(caller)) return { error: 100 };
    for (const provider of providers) {
      if (!this.verifiedProviders.has(provider)) {
        this.verifiedProviders.set(provider, true);
      }
    }
    return { value: true };
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 };
    this.admin = newAdmin;
    return { value: true };
  },
};

describe("Voltora Verified Provider Registry", () => {
  const admin = "ST1ADMIN00000000000000000000000000000000";
  const provider = "ST2ENERGY0000000000000000000000000000000";

  beforeEach(() => {
    mockContract.admin = admin;
    mockContract.verifiedProviders = new Map();
    mockContract.providerMetadata = new Map();
  });

  it("should register a new provider by admin", () => {
    const result = mockContract.registerProvider(
      admin,
      provider,
      "SolarCo",
      "WestGrid",
      "solar"
    );

    expect(result).toEqual({ value: true });
    expect(mockContract.isVerifiedProvider(provider)).toBe(true);

    const metadata = mockContract.getProviderMetadata(provider);
    expect(metadata).toEqual({
      value: { name: "SolarCo", region: "WestGrid", type: "solar" },
    });
  });

  it("should not register provider with empty name", () => {
    const result = mockContract.registerProvider(admin, provider, "", "West", "solar");
    expect(result).toEqual({ error: 103 });
  });

  it("should not allow non-admin to register a provider", () => {
    const result = mockContract.registerProvider(
      "ST3NONADMIN0000000000000000000000000000000",
      provider,
      "WindWorks",
      "NorthZone",
      "wind"
    );
    expect(result).toEqual({ error: 100 });
  });

  it("should not re-register an existing provider", () => {
    mockContract.registerProvider(admin, provider, "VoltWind", "East", "wind");
    const result = mockContract.registerProvider(admin, provider, "VoltWind", "East", "wind");
    expect(result).toEqual({ error: 101 });
  });

  it("should allow admin to remove a provider", () => {
    mockContract.registerProvider(admin, provider, "HydroNet", "RiverSouth", "hydro");
    const result = mockContract.removeProvider(admin, provider);

    expect(result).toEqual({ value: true });
    expect(mockContract.isVerifiedProvider(provider)).toBe(false);
  });

  it("should allow admin to update provider metadata", () => {
    mockContract.registerProvider(admin, provider, "VoltCore", "RegionX", "solar");

    const result = mockContract.updateProviderMetadata(
      admin,
      provider,
      "VoltCore Renewables",
      "RegionY",
      "hybrid"
    );

    expect(result).toEqual({ value: true });

    const metadata = mockContract.getProviderMetadata(provider);
    expect(metadata).toEqual({
      value: { name: "VoltCore Renewables", region: "RegionY", type: "hybrid" },
    });
  });

  it("should allow bulk verification by admin", () => {
    const providers = [
      "ST2A111",
      "ST2B222",
      "ST2C333",
      "ST2D444",
    ];

    const result = mockContract.bulkVerify(admin, providers);
    expect(result).toEqual({ value: true });

    for (const p of providers) {
      expect(mockContract.isVerifiedProvider(p)).toBe(true);
    }
  });

  it("should transfer admin rights to another principal", () => {
    const newAdmin = "ST9NEWADMIN000000000000000000000000000";

    const result = mockContract.transferAdmin(admin, newAdmin);
    expect(result).toEqual({ value: true });

    // Now only newAdmin can register
    const reg = mockContract.registerProvider(
      newAdmin,
      "ST9PROVNEW",
      "EcoVolt",
      "Zone9",
      "solar"
    );

    expect(reg).toEqual({ value: true });
  });
});
