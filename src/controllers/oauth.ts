import axios from 'axios';
import type { Request, Response } from 'express';
import { logger } from 'src/logger';

const redirectUri = `http://localhost:${process.env.PORT}/authorization-code/callback`;

const state = '1234567890';

class OauthController {
  static getCode(_req: Request, res: Response): void {
    const uri = `${process.env.AUTH_URI}?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=openid%20email%20profile&state=${state}`;

    logger.info({ uri });

    res.redirect(uri);
  }

  static async callback(req: Request, res: Response): Promise<void> {
    const { code } = req.query;

    const params = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    };

    const headers = {
      'Authorization': `Basic ${Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const oktaRes = await axios.post<{ access_token: string }>(process.env.TOKEN_URI, params, {
      headers,
    });

    const infoHeaders = {
      Authorization: `Bearer ${oktaRes.data.access_token}`,
    };

    logger.info({ infoHeaders });

    const info = await axios.get<Record<string, string>>(process.env.USERINFO_URI, {
      headers: infoHeaders,
    });

    res.status(200).send({ userInfo: info.data });
  }
}

export default OauthController;
