import axios from 'axios'

export interface AlloraInferenceData {
    network_inference: string
    network_inference_normalized: string
    confidence_interval_percentiles: string[]
    confidence_interval_percentiles_normalized: string[]
    confidence_interval_values: string[]
    confidence_interval_values_normalized: string[]
    topic_id: string
    timestamp: number
    extra_data: string
}

export interface AlloraAPIResponse {
    request_id: string
    status: boolean
    data: {
        signature: string
        inference_data: AlloraInferenceData
    }
}

export enum AlloraPricePredictionToken {
    BTC = 'BTC',
    ETH = 'ETH',
}

export enum AlloraPricePredictionTimeframe {
    '5m' = '5m',
    '8h' = '8h',
}

export enum AlloraPricePredictionSignatureFormat {
    EthereumSepolia = 'ethereum-11155111'
}

export interface AlloraAPIClientOptions {
    apiKey?: string
    apiRoot?: string
}

export class AlloraAPIClient {
    private apiKey:  string | null | undefined
    private apiRoot: string

    constructor(opts: AlloraAPIClientOptions) {
        this.apiKey  = opts.apiKey

        opts.apiRoot = opts.apiRoot || 'https://api.upshot.xyz/v2/allora'
        this.apiRoot = opts.apiRoot[opts.apiRoot.length - 1] === '/' ? opts.apiRoot.substr(0, opts.apiRoot.length - 1) : opts.apiRoot
    }

    public async fetchAlloraPricePrediction(
        asset:           AlloraPricePredictionToken,
        timeframe:       AlloraPricePredictionTimeframe,
        signatureFormat: AlloraPricePredictionSignatureFormat = AlloraPricePredictionSignatureFormat.EthereumSepolia,
    ): Promise<Partial<AlloraInferenceData>> {
        const url = `consumer/price/${signatureFormat}/${asset}/${timeframe}`
        const resp = await this.fetchAlloraAPIData(url)
        if (!resp?.data?.inference_data) {
            throw new Error(`API response missing data: ${JSON.stringify(resp)}`)
        }
        return resp.data.inference_data
    }

    private async fetchAlloraAPIData(endpoint: string): Promise<Partial<AlloraAPIResponse>> {
        endpoint = endpoint[0] === '/' ? endpoint.substr(1) : endpoint

        const url = `${this.apiRoot}/${endpoint}`
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
        }
        if (!!this.apiKey) {
            headers['x-api-key'] = this.apiKey
        }

        const response = await axios.get(url, { headers })
        if (response.status >= 400) {
            throw new Error(`Allora plugin: error requesting price prediction: url=${url} status=${response.status} body=${JSON.stringify(response.data, null, 4)}`)
        }

        return response.data
    }
}
