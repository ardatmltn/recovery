import crypto from 'crypto'

// İyzico configuration
export type IyzicoConfig = {
  apiKey: string
  secretKey: string
  baseUrl: string
}

function getConfig(): IyzicoConfig {
  return {
    apiKey: process.env.IYZICO_API_KEY!,
    secretKey: process.env.IYZICO_SECRET_KEY!,
    baseUrl: process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com',
  }
}

// Generate HMAC-SHA256 authorization header
function generateAuthorizationHeader(
  config: IyzicoConfig,
  randomString: string,
  requestBody: string
): string {
  const payload = config.apiKey + randomString + requestBody
  const hmac = crypto.createHmac('sha256', config.secretKey)
  hmac.update(payload)
  const hash = hmac.digest('base64')
  return `IYZWSv2 apiKey:${config.apiKey}&randomKey:${randomString}&signature:${hash}`
}

// Verify İyzico webhook signature
export function verifyWebhookSignature(
  secretKey: string,
  paymentConversationId: string,
  iyziReferenceCode: string,
  merchantId: string,
  status: string,
  receivedSignature: string
): boolean {
  const payload = secretKey + paymentConversationId + iyziReferenceCode + merchantId + status
  const expected = crypto.createHmac('sha256', secretKey).update(payload).digest('base64')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature))
}

// İyzico payment status codes
export const IYZICO_STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
} as const

// İyzico failure reason codes
export const IYZICO_FAILURE_CODES: Record<string, string> = {
  '1': 'Insufficient funds',
  '2': 'Do not honor',
  '3': 'Invalid transaction',
  '4': 'Pick up card',
  '5': 'General decline',
  '6': 'Expired card',
  '10008': 'Card stolen',
  '10012': 'Invalid card number',
  '10057': 'Transaction not permitted',
  '10058': 'Transaction not permitted to cardholder',
}

// Generic API request helper
async function request<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const config = getConfig()
  const randomString = Math.random().toString(36).substring(2, 15)
  const bodyStr = JSON.stringify(body)
  const authorization = generateAuthorizationHeader(config, randomString, bodyStr)

  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      'x-iyzi-rnd': randomString,
      'x-iyzi-client-version': 'recoverly/1.0',
    },
    body: bodyStr,
  })

  return response.json() as Promise<T>
}

// Retry a payment with saved card token
export async function retryPaymentWithToken(params: {
  conversationId: string
  price: string
  paidPrice: string
  currency: string
  paymentCard: {
    cardToken: string
    cardUserKey: string
  }
  buyer: {
    id: string
    name: string
    surname: string
    email: string
    identityNumber: string
    registrationAddress: string
    city: string
    country: string
  }
  basketId: string
  basketItems: Array<{
    id: string
    name: string
    category1: string
    itemType: 'VIRTUAL' | 'PHYSICAL'
    price: string
  }>
}) {
  return request('/payment/auth', {
    locale: 'tr',
    conversationId: params.conversationId,
    price: params.price,
    paidPrice: params.paidPrice,
    currency: params.currency,
    installment: '1',
    basketId: params.basketId,
    paymentChannel: 'WEB',
    paymentGroup: 'SUBSCRIPTION',
    paymentCard: params.paymentCard,
    buyer: params.buyer,
    shippingAddress: {
      contactName: `${params.buyer.name} ${params.buyer.surname}`,
      city: params.buyer.city,
      country: params.buyer.country,
      address: params.buyer.registrationAddress,
    },
    billingAddress: {
      contactName: `${params.buyer.name} ${params.buyer.surname}`,
      city: params.buyer.city,
      country: params.buyer.country,
      address: params.buyer.registrationAddress,
    },
    basketItems: params.basketItems,
  })
}

// Test connection using explicit config (for org-stored credentials)
export async function testConnectionWithConfig(
  config: IyzicoConfig
): Promise<{ success: boolean; message: string }> {
  try {
    const randomString = Math.random().toString(36).substring(2, 15)
    const body = JSON.stringify({
      locale: 'tr',
      conversationId: `recoverly-test-${Date.now()}`,
      binNumber: '554960',
    })
    const authorization = generateAuthorizationHeader(config, randomString, body)

    const response = await fetch(`${config.baseUrl}/payment/installment/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
        'x-iyzi-rnd': randomString,
        'x-iyzi-client-version': 'recoverly/1.0',
      },
      body,
    })

    if (!response.ok) {
      return { success: false, message: `HTTP ${response.status}: Could not reach İyzico API` }
    }

    const json = await response.json() as { status: string; errorMessage?: string }

    if (json.status === 'success') {
      return { success: true, message: 'Connection successful! Credentials are valid.' }
    }

    // İyzico returned a proper response but credentials may be wrong
    if (json.errorMessage) {
      return { success: false, message: json.errorMessage }
    }

    return { success: false, message: 'Unexpected response from İyzico API' }
  } catch (err) {
    return { success: false, message: `Network error: ${(err as Error).message}` }
  }
}

export const iyzico = { retryPaymentWithToken, verifyWebhookSignature, testConnectionWithConfig }
