// Service JWT pour l'authentification sécurisée
class JWTService {
  private readonly SECRET_KEY = 'amande_secret_key_2024'
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 heures

  generateToken(payload: any): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }

    const now = Date.now()
    const exp = now + this.TOKEN_EXPIRY

    const tokenPayload = {
      ...payload,
      iat: now,
      exp: exp
    }

    const headerEncoded = btoa(JSON.stringify(header))
    const payloadEncoded = btoa(JSON.stringify(tokenPayload))
    const signature = this.createSignature(headerEncoded, payloadEncoded)
    
    return `${headerEncoded}.${payloadEncoded}.${signature}`
  }

  verifyToken(token: string): any | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const [headerEncoded, payloadEncoded, signature] = parts
      
      const expectedSignature = this.createSignature(headerEncoded, payloadEncoded)
      if (signature !== expectedSignature) return null

      const payload = JSON.parse(atob(payloadEncoded))
      
      if (payload.exp && Date.now() > payload.exp) {
        return null
      }

      return payload
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
      return null
    }
  }

  private createSignature(header: string, payload: string): string {
    const data = `${header}.${payload}`
    return btoa(data + this.SECRET_KEY).slice(0, 20)
  }

  isTokenExpired(token: string): boolean {
    const payload = this.verifyToken(token)
    if (!payload) return true
    
    return payload.exp && Date.now() > payload.exp
  }

  refreshToken(token: string): string | null {
    const payload = this.verifyToken(token)
    if (!payload) return null

    const { iat, exp, ...userData } = payload
    return this.generateToken(userData)
  }

  getUserFromToken(token: string): any | null {
    const payload = this.verifyToken(token)
    if (!payload) return null

    const { iat, exp, ...userData } = payload
    return userData
  }
}

export const jwtService = new JWTService() 