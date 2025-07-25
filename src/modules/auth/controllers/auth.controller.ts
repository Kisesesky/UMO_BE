// src/auth/auth.controller.ts
import { BadRequestException, Body, Controller, Get, HttpCode, Patch, Post, Req, Request, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestOrigin } from 'src/common/decorators/request-origin.decorator';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { CookieUtil } from 'src/common/utils/cookie-util';
import { TimeUtil } from 'src/common/utils/time-util';
import { AppConfigService } from 'src/config/app/config.service';
import { GcsService } from 'src/modules/gcs/gcs.service';
import { UsersService } from 'src/modules/users/users.service';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { PasswordCheckDto } from '../dto/password-check.dto';
import { RegisterDto } from '../dto/register.dto';
import { SocialTermsAgreeDto } from '../dto/social-termsagree.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { KakaoAuthGuard } from '../guards/kakao-auth.guard';
import { NaverAuthGuard } from '../guards/naver-auth.guard';
import { AuthService } from '../services/auth.service';
import { UserTokenService } from '../services/user.token.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
    private readonly gcsService: GcsService,
    private readonly usersService: UsersService,
    private readonly userTokenService: UserTokenService,
    ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '로그인', description: '이메일과 비밀번호로 로그인합니다.' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패 (이메일 또는 비밀번호 불일치)', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @RequestOrigin() origin: string,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
    
    const result = await this.authService.logIn(user, origin);
    
    // 쿠키 설정은 여기서 따로 수행
    const accessOptions = CookieUtil.getCookieOptions(
      TimeUtil.convertExpiresInToMs(this.appConfigService.accessExpiresIn),
      origin,
      false,
    );
    const refreshOptions = CookieUtil.getCookieOptions(
      TimeUtil.convertExpiresInToMs(this.appConfigService.jwtRefreshExpiresIn),
      origin,
      true,
    );
    
    res.cookie('access_token', result.accessToken, accessOptions);
    res.cookie('refresh_token', result.refreshToken, refreshOptions);
    
    return result;
  }

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '회원가입 정보 및 프로필 이미지',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'UMO' },
        email: { type: 'string', example: 'test@test.com' },
        password: { type: 'string', example: 'Password123!' },
        agreedTerms: { type: 'boolean', example: true },
        agreedPrivacy: { type: 'boolean', example: true },
        profileImage: { type: 'string', format: 'binary' },
      },
      required: ['name', 'email', 'password', 'agreedTerms', 'agreedPrivacy'],
    },
  })
  @ApiResponse({ status: 201, description: '회원가입 성공', type: UserResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터 (유효성 검사 실패)', type: ErrorResponseDto })
  @ApiResponse({ status: 409, description: '이미 사용 중인 이메일입니다.', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  @UseInterceptors(FileInterceptor('profileImage', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('이미지 파일만 업로드할 수 있습니다.'), false);
      }
      cb(null, true);
    },
  }))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerDto: RegisterDto,
  ): Promise<UserResponseDto> {
    // 1. 파일이 있으면 GCS 업로드, 없으면 기본 이미지 사용
    const profileImageUrl = file
    ? await this.gcsService.uploadFile(file)
    : this.appConfigService.defaultProfileImg;

    return this.authService.register({
      ...registerDto,
      profileImage: profileImageUrl,
    } as any);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: '토큰 갱신', description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.' })
  @ApiResponse({ status: 200, description: '토큰 갱신 성공', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: '유효하지 않거나 만료된 리프레시 토큰', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  @ApiCookieAuth('refresh_token')
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
    @RequestOrigin() origin: string,
  ): Promise<AuthResponseDto> {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }
    
    const result = await this.authService.refreshToken(refreshToken, origin);
    
    response.cookie('access_token', result.accessToken, result.accessOptions);
    
    const { accessOptions, ...responseData } = result;
    return responseData;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '로그아웃', description: '사용자를 로그아웃 처리합니다.' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @RequestOrigin() origin: string,
    @RequestUser() user: UserResponseDto,
  ): Promise<{ message: string }> {
    console.log(`User ${user.email} logged out`);
    
    const { accessOptions, refreshOptions } = this.authService.expireJwtToken(origin);
    
    res.cookie('access_token', '', accessOptions);
    res.cookie('refresh_token', '', refreshOptions);
    
    return { message: '로그아웃 되었습니다.' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 프로필 조회', description: '현재 로그인한 사용자의 프로필 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공', type: UserResponseDto })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '프로필을 찾을 수 없음', type: ErrorResponseDto }) // (사용자 본인 정보가 없을 경우)
  @ApiResponse({ status: 500, description: '서버 오류', type: ErrorResponseDto })
  getProfile(@RequestUser() user: UserResponseDto): UserResponseDto {
    return user;
  }

  @Get('google')
  @ApiOperation({ summary: '구글 로그인', description: '구글 로그인 페이지로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: '구글 로그인 페이지로 리다이렉트' })
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Passport가 자동 리다이렉트
    return;
  }

  @Get('google/callback')
  @ApiOperation({ summary: '구글 로그인 콜백', description: '구글 인증 후 프론트엔드로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: '프론트엔드로 리다이렉트' })
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @RequestOrigin() origin: string, @Res({ passthrough: true }) res: Response) {
    // req.user는 GoogleStrategy에서 done(null, userProfile)로 넘어온 객체
    const socialProfile = req.user; // socialProfile로 이름 변경하여 명확하게

    // validateSocialLogin을 통해 사용자 찾거나 생성
    const user = await this.authService.validateSocialLogin(socialProfile);

    if (!user.agreedTerms || !user.agreedPrivacy) {
      // 약관 미동의: 토큰 발급 없이 약관 동의 화면으로 리다이렉트
      // URL 뒤에 socialId 등(임시 식별값) 추가
      return res.redirect(
        `${this.appConfigService.frontendUrl}/auth/social-terms?socialId=${user.socialId}&provider=${user.provider}`
      );
    }
  
    // 약관 동의된 회원만 JWT 및 쿠키 제공 (정상 로그인)
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      this.userTokenService.makeJwtToken(user.email, origin);
  
    res.cookie('access_token', accessToken, accessOptions);
    res.cookie('refresh_token', refreshToken, refreshOptions);
    
    // 프론트엔드로 리디렉션
    return res.redirect(`${this.appConfigService.frontendUrl}/auth/social-callback`);
  }

  @Get('kakao')
  @ApiOperation({ summary: '카카오 로그인', description: '카카오 로그인 페이지로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: '카카오 로그인 페이지로 리다이렉트' })
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션됨
    return;
  }

  @Get('kakao/callback')
  @ApiOperation({ summary: '카카오 로그인 콜백', description: '카카오 인증 후 프론트엔드로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: '프론트엔드로 리다이렉트' })
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Req() req, @RequestOrigin() origin: string, @Res({ passthrough: true }) res: Response) {
    // req.user는 KakaoStrategy에서 done(null, userProfile)로 넘어온 객체
    const socialProfile = req.user; // socialProfile로 이름 변경하여 명확하게
    
    // validateSocialLogin을 통해 사용자 찾거나 생성
    const user = await this.authService.validateSocialLogin(socialProfile);

    if (!user.agreedTerms || !user.agreedPrivacy) {
      // 약관 미동의: 토큰 발급 없이 약관 동의 화면으로 리다이렉트
      // URL 뒤에 socialId 등(임시 식별값) 추가
      return res.redirect(
        `${this.appConfigService.frontendUrl}/auth/social-terms?socialId=${user.socialId}&provider=${user.provider}`
      );
    }
  
    // 약관 동의된 회원만 JWT 및 쿠키 제공 (정상 로그인)
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      this.userTokenService.makeJwtToken(user.email, origin);

    res.cookie('access_token', accessToken, accessOptions);
    res.cookie('refresh_token', refreshToken, refreshOptions);
    
    // 프론트엔드로 리디렉션
    return res.redirect(`${this.appConfigService.frontendUrl}/auth/social-callback`);
  }

  @Get('naver')
  @ApiOperation({ summary: '네이버 로그인', description: '네이버 로그인 페이지로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: '네이버 로그인 페이지로 리다이렉트' })
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    // 네이버 로그인 페이지로 리다이렉트됨
    return;
  }

  @Get('naver/callback')
  @ApiOperation({ summary: '네이버 로그인 콜백', description: '네이버 인증 후 프론트엔드로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: '프론트엔드로 리다이렉트' })
  @UseGuards(NaverAuthGuard)
  async naverCallback(
    @Req() req,
    @RequestOrigin() origin: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const socialProfile = req.user;

    const user = await this.authService.validateSocialLogin(socialProfile);

    if (!user.agreedTerms || !user.agreedPrivacy) {
      // 약관 미동의: 토큰 발급 없이 약관 동의 화면으로 리다이렉트
      // URL 뒤에 socialId 등(임시 식별값) 추가
      return res.redirect(
        `${this.appConfigService.frontendUrl}/auth/social-terms?socialId=${user.socialId}&provider=${user.provider}`
      );
    }
  
    // 약관 동의된 회원만 JWT 및 쿠키 제공 (정상 로그인)
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      this.userTokenService.makeJwtToken(user.email, origin);

    res.cookie('access_token', accessToken, accessOptions);
    res.cookie('refresh_token', refreshToken, refreshOptions);

    return res.redirect(`${this.appConfigService.frontendUrl}/auth/social-callback`);
  }

  @Patch('social-terms/agree')
  async agreeTerms(
    @Body() dto: SocialTermsAgreeDto,
    @Res({ passthrough: true }) res: Response,
    @RequestOrigin() origin: string
    ) {
    // 1. 해당 소셜 유저 validate
    const user = await this.usersService.findUserBySocialId(dto.socialId, dto.provider);
    if (!user) throw new BadRequestException('유저 없음');
    // 2. 동의 여부 갱신
    user.agreedTerms = dto.agreedTerms;
    user.agreedPrivacy = dto.agreedPrivacy;
    await this.usersService.update(user.id, user);
    // 3. JWT 발급 및 쿠키 세팅
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      this.userTokenService.makeJwtToken(user.email, origin);

    res.cookie('access_token', accessToken, accessOptions);
    res.cookie('refresh_token', refreshToken, refreshOptions);

    return { success: true };
  }

  @Post('verify-password')
  @ApiOperation({ summary: '비밀번호 검증', description: '현재 로그인한 사용자의 비밀번호를 검증합니다.' })
  @ApiBody({ type: PasswordCheckDto })
  @ApiResponse({ status: 200, description: '비밀번호 일치 여부', schema: { example: { valid: true } } })
  @ApiResponse({ status: 401, description: '비밀번호 불일치 또는 인증 실패', type: ErrorResponseDto })
  @UseGuards(JwtAuthGuard)
  async verifyPassword(
    @Req() req,
    @Body() dto: PasswordCheckDto,
  ): Promise<{ valid: boolean }> {
    const valid = await this.authService.verifyPassword(req.user.id, dto.password);
    if (!valid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return { valid: true };
  }
}