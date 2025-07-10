// src/common/templates/email-check-templates.ts

export function getUmoVerificationLinkTemplate(
  verifyUrl: string,
  type: 'signup' | 'password' = 'signup'
) {
  // 안내 문구 분기
  const contextMessage =
    type === 'signup'
      ? `아래 <b style="color:#4D42B3;">[이메일 인증하기]</b> <br/>버튼을 누르시면 <b style="color: #4D42B3;">회원가입</b>이 완료됩니다.`
      : `아래 <b style="color:#4D42B3;">[이메일 인증하기]</b> <br/>버튼을 누르시면 <b style="color: #4D42B3;">비밀번호 재설정</b>이 가능합니다.`;

  const completeMessage =
    type === 'signup'
      ? '인증이 완료되면 회원가입을 계속 진행할 수 있습니다.'
      : '인증이 완료되면 비밀번호 재설정을 계속 진행할 수 있습니다.';

  return `
  <div style="max-width: 480px; margin: 40px auto; padding: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #E3E6E9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(77,66,179,0.08); overflow: hidden;">
      <tr>
        <td style="padding: 36px 16px 16px 16px;">
          <!-- 안내 문구 + 로고 (테이블 방식) -->
          <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto 18px auto;">
            <tr>
              <td style="vertical-align: middle; text-align: center;">
                <img src="cid:umo-logo" alt="UMO Logo" style="height: 30px; width: 60px; display: inline-block; vertical-align: middle; margin-right: 8px; max-width: 100%;" />
              </td>
              <td style="vertical-align: middle; text-align: center;">
                <span style="font-size: 15px; color: #4D42B3; font-weight: 600; vertical-align: middle;">
                  UMO를 이용해주셔서 감사합니다.
                </span>
              </td>
            </tr>
          </table>
          <!-- 캐릭터 얼굴 -->
          <div style="text-align:center; margin-bottom: 12px;">
            <img src="cid:umo-face2" alt="UMO 캐릭터"
              style="width: 100%; max-width: 240px; height: auto;" />
          </div>
          <h2 style="font-size: 20px; font-weight: 700; color: #4D42B3; margin: 0 0 14px 0; letter-spacing: -1px; text-align:center;">이메일 인증 안내</h2>
          <p style="font-size: 15px; color: #444; margin-bottom: 30px; line-height: 1.7; text-align:center;">
            안녕하세요!<br>
            <span style="color: #4D42B3; font-weight: 600;">UMO</span> 서비스를 이용해주셔서 감사합니다.<br>
            ${contextMessage}
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; padding: 16px 0; width: 100%; max-width: 220px; background: linear-gradient(90deg, #4D42B3 0%, #AFC8FA 100%); color: #fff; font-size: 18px; font-weight: 700; border-radius: 8px; text-decoration: none; letter-spacing: 1px; box-shadow: 0 2px 8px #4D42B344; transition: background 0.2s;">
              이메일 인증하기
            </a>
          </div>
          <p style="font-size: 13px; color: #888; line-height: 1.7; margin-bottom: 0; text-align:center;">
            인증 링크는 <b style="color: #4D42B3;">10분간만 유효</b>합니다.<br>
            ${completeMessage}<br>
            본인이 요청하지 않았다면 이 메일을 무시해 주세요.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background: #E3E6E9; padding: 20px 16px 16px 16px; text-align: center;">
          <div style="font-size: 12px; color: #888; line-height: 1.7;">
            UMO 주식회사<br>
            서울특별시 성동구 아차산로 17길 48, 성수낙낙 2층<br>
            Copyright ⓒ UMO. All Rights Reserved.
          </div>
          <div style="font-size: 11px; color: #bbb; margin-top: 10px;">
            ※ 본 메일은 발신 전용입니다. 회신하셔도 답변드릴 수 없습니다.
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;
}
