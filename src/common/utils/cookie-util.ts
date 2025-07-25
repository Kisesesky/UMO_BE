// src/common/utils/cookie-util.ts
import { CookieOptions } from 'express';

export class CookieUtil {
  static getCookieOptions(maxAge: number, requestDomain: string, isHttpOnly = true): CookieOptions {
    let domain: string | undefined;
    let isLocalhost = false;

    if (
      requestDomain.includes('127.0.0.1') ||
      requestDomain.includes('localhost')
    ) {
      isLocalhost = true;
      domain = undefined;
    } else {
      try {
        const url = new URL(
          requestDomain.startsWith('http') ? requestDomain : `https://${requestDomain}`,
        );
        console.log(`Setting cookie options for domain: ${requestDomain}`);
        const parsedDomain = url.hostname.replace(/^www\./, '');
        // 프론트 도메인과 서버 도메인이 다르면 domain 설정하지 않음
        if (parsedDomain.endsWith('everyday-umo.site')) {
          domain = '.everyday-umo.site';
        }
      } catch (e) {
        console.log(`Invalid requestDomain for URL parsing: ${requestDomain}. Falling back to hostname.`, e.stack);
      }
    }
  
    const cookieOptions: CookieOptions = {
      path: '/',
      httpOnly: isHttpOnly,
      maxAge,
      secure: !isLocalhost,         // 🔧 로컬에서는 false
      sameSite: isLocalhost ? 'lax' : 'none', // 🔧 크로스도메인이 아니므로 'lax'로
    };
  
    if (domain) {
      cookieOptions.domain = domain;
    }
  
    return cookieOptions;
  }
}
