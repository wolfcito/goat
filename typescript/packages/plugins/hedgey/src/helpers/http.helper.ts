import { ethers } from "ethers";

export async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}: ${errorText}`);
    }
    return response.json();
}

export function toBytes16(campaignId: string): string {
    return ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes(campaignId), 16);
}
