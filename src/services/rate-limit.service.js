const rateLimitStore = new Map();

class RateLimitService {
  constructor(maxRequests = 30, windowMs = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  getClientIPAddress(req) {
    const forwarded = req.headers.get('x-forwarded-for');

    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;

    return ip;
  }

  limit(req) {
    const clientIp = this.getClientIPAddress(req);

    if (!clientIp) {
      return Response.json(
        {
          message: 'IP address is required'
        },
        {
          status: 500,
        }
      );
    }

    const now = Date.now();
    const hourKey = Math.floor(now / this.windowMs);
    const clientKey = `${clientIp}:${hourKey}`;

    const record = rateLimitStore.get(clientKey) || { count: 0 };
    record.count += 1;
    rateLimitStore.set(clientKey, record);

    if (record.count > this.maxRequests) {
      return Response.json(
        {
          message: `Too many requests, please try again in ${
            Math.ceil((1000 * 60 * 60 - (now - hourKey * this.windowMs)) / 1000)
          } seconds`,
        },
        {
          status: 429,
        }
      );
    }

    return null;
  }
}

export default RateLimitService;
