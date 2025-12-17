// Network Design Models and Service with Backend Integration
import axios from "axios";

const API_BASE_URL = "https://backend.fiberonix.in/api/network-device/designs/";

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `${token}` }),
  };
};

// Asymmetric Coupler Definition
export interface AsymmetricCoupler {
  name: string;
  loss1: number; // tap / lower power side (Drop) in dB
  loss2: number; // through / higher power side (Continue) in dB
}

export const asymmetricCouplers: AsymmetricCoupler[] = [
  { name: "50/50", loss1: 3.2, loss2: 3.2 },
  { name: "45/55", loss1: 3.7, loss2: 2.8 },
  { name: "40/60", loss1: 4.2, loss2: 2.4 },
  { name: "35/65", loss1: 4.8, loss2: 2.1 },
  { name: "30/70", loss1: 5.4, loss2: 1.8 },
  { name: "25/75", loss1: 6.2, loss2: 1.5 },
  { name: "20/80", loss1: 7.7, loss2: 1.3 },
  { name: "15/85", loss1: 8.4, loss2: 0.91 },
  { name: "10/90", loss1: 10.0, loss2: 0.66 },
  { name: "05/95", loss1: 13.0, loss2: 0.42 },
];

// Map for fast lookup
export const couplerLossMap: Record<string, AsymmetricCoupler> = 
  asymmetricCouplers.reduce((acc, c) => ({ ...acc, [c.name]: c }), {});

// PLC Splitter Definition
export interface PlcSplitter {
  name: string;
  loss: number;
}

export const plcSplitters: PlcSplitter[] = [
  { name: "1×4", loss: 6.5 },
  { name: "1×8", loss: 9.5 },
  { name: "1×16", loss: 12.5 },
  { name: "1×32", loss: 15.5 },
  { name: "1×64", loss: 18.5 },
  { name: "1×128", loss: 21.5 },
];

// Coupler Data for calculations
export class CouplerData {
  id?: number;
  inputPower: number; // dBm
  couplerType: string; // e.g. "10/90"
  lossPerKm: number; // dB/km
  distance1: number; // km (Tap/Drop)
  distance2: number; // km (Through)

  constructor(
    inputPower: number = 0,
    couplerType: string = "10/90",
    lossPerKm: number = 0.2,
    distance1: number = 0,
    distance2: number = 0,
    id?: number
  ) {
    this.inputPower = inputPower;
    this.couplerType = couplerType;
    this.lossPerKm = lossPerKm;
    this.distance1 = distance1;
    this.distance2 = distance2;
    this.id = id;
  }

  // Create a copy
  copy(): CouplerData {
    return new CouplerData(
      this.inputPower,
      this.couplerType,
      this.lossPerKm,
      this.distance1,
      this.distance2,
      this.id
    );
  }

  // Tap Output (Loss1)
  get outputPower1(): number {
    const loss = couplerLossMap[this.couplerType];
    if (!loss) return this.inputPower;
    return this.inputPower - loss.loss1 - (this.distance1 * this.lossPerKm);
  }

  // Through Output (Loss2)
  get outputPower2(): number {
    const loss = couplerLossMap[this.couplerType];
    if (!loss) return this.inputPower;
    return this.inputPower - loss.loss2 - (this.distance2 * this.lossPerKm);
  }

  // Convert to JSON for API
  toJson(): Record<string, any> {
    return {
      ...(this.id !== undefined && { id: this.id }),
      coupler_ratio: this.couplerType,
      tap_km: this.distance1,
      tap_output_dbm: this.outputPower1,
      throughput_km: this.distance2,
      through_output_dbm: this.outputPower2,
    };
  }

  // Create from API JSON
  static fromJson(json: Record<string, any>): CouplerData {
    let rawType = json.coupler_ratio?.toString() || "10/90";
    
    // Normalize format: replace ':' with '/'
    let normalized = rawType.replace(/:/g, '/');

    // Check if it exists in our known map
    if (!couplerLossMap[normalized]) {
      // Try reversing parts (e.g. 70/30 -> 30/70)
      const parts = normalized.split('/');
      if (parts.length === 2) {
        const reversed = `${parts[1]}/${parts[0]}`;
        if (couplerLossMap[reversed]) {
          normalized = reversed;
        } else {
          // Fallback if neither exists
          normalized = "10/90";
        }
      } else {
        normalized = "10/90";
      }
    }

    return new CouplerData(
      0, // inputPower will be calculated
      normalized,
      0.2, // default lossPerKm
      parseFloat(json.tap_km) || 0,
      parseFloat(json.throughput_km) || 0,
      json.id
    );
  }
}

export interface NetworkDesignModel {
  id?: string;
  name: string;
  createdAt: Date;
  status: 'Active' | 'Completed' | 'Draft';
  initialInputPower: number;
  couplers: CouplerData[];
  description?: string;
}

// Network Repository with API Integration
export class NetworkRepository {
  private static instance: NetworkRepository;

  private constructor() {}

  static getInstance(): NetworkRepository {
    if (!NetworkRepository.instance) {
      NetworkRepository.instance = new NetworkRepository();
    }
    return NetworkRepository.instance;
  }

  async getDesigns(): Promise<NetworkDesignModel[]> {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        const data = response.data as any[];
        return data.map((json) => this.parseDesignFromJson(json));
      }
      throw new Error(`Failed to load designs: ${response.status}`);
    } catch (error: any) {
      console.error("Error fetching designs:", error);
      throw new Error(`Error fetching designs: ${error.message}`);
    }
  }

  async getDesignById(id: string): Promise<NetworkDesignModel | undefined> {
    try {
      const response = await axios.get(`${API_BASE_URL}${id}/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        return this.parseDesignFromJson(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching design:", error);
      return undefined;
    }
  }

  async saveDesign(design: NetworkDesignModel): Promise<void> {
    const headers = getAuthHeaders();
    const body = this.designToJson(design);

    try {
      if (!design.id) {
        // CREATE
        const response = await axios.post(API_BASE_URL, body, { headers });
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Failed to create design: ${response.data}`);
        }
      } else {
        // UPDATE
        const url = `${API_BASE_URL}${design.id}/`;
        try {
          const response = await axios.put(url, body, { headers });
          if (response.status !== 200) {
            throw new Error(`Failed to update design: ${response.data}`);
          }
        } catch (error: any) {
          // Fallback to PATCH if PUT fails with 405
          if (error.response?.status === 405) {
            const patchResponse = await axios.patch(url, body, { headers });
            if (patchResponse.status !== 200) {
              throw new Error(`Failed to update design (PATCH): ${patchResponse.data}`);
            }
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error("Error saving design:", error);
      throw new Error(`Error saving design: ${error.message}`);
    }
  }

  async deleteDesign(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${API_BASE_URL}${id}/`, {
        headers: getAuthHeaders(),
      });

      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Failed to delete design: ${response.status} - ${response.data}`);
      }
    } catch (error: any) {
      console.error("Error deleting design:", error);
      throw new Error(`Error deleting design: ${error.message}`);
    }
  }

  // Helper: Parse design from API JSON
  private parseDesignFromJson(json: Record<string, any>): NetworkDesignModel {
    const couplerList = (json.couplers as any[]) || [];
    const couplerObjs = couplerList.map((c) => CouplerData.fromJson(c));

    return {
      id: json.id?.toString(),
      name: json.name || '',
      initialInputPower: parseFloat(json.input_power) || 0,
      couplers: couplerObjs,
      createdAt: json.created_at ? new Date(json.created_at) : new Date(),
      status: (json.status as 'Active' | 'Completed' | 'Draft') || 'Active',
      description: json.description,
    };
  }

  // Helper: Convert design to API JSON
  private designToJson(design: NetworkDesignModel): Record<string, any> {
    return {
      name: design.name,
      input_power: design.initialInputPower,
      couplers: design.couplers.map((c) => c.toJson()),
      status: design.status,
    };
  }
}

// Singleton instance
export const networkRepository = NetworkRepository.getInstance();
