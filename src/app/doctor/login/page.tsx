'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { loginSchema, type LoginFormData } from '@/lib/validations/login';
import { PORTAL_CONFIGS } from '@/config/portals.config';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const portalConfig = PORTAL_CONFIGS.doctor;

export default function DoctorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedLanguage, setUser, setProcessing, isProcessing } = useStore();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const Icon = portalConfig.icon;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
    shouldFocusError: false,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('email');
    if (remembered === 'true' && savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setProcessing(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastPortal', portalConfig.id);
      }

      const response = await authApi.supabaseLogin(
        { email: data.email, password: data.password },
        portalConfig.id
      );

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast({
          title: t('loginSuccess', 'Login successful!'),
          description: `${t('welcomeBack', 'Welcome back')}, ${response.data.user.name}!`,
        });

        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('email', data.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('email');
        }

        setTimeout(() => router.push(portalConfig.dashboardRoute), 1200);
      } else {
        const msg = response.error || t('loginError', 'Invalid email or password');
        setError(msg);
        toast({ variant: 'destructive', title: 'Error', description: msg });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'An error occurred. Please try again.';
      setError(msg);
      toast({ variant: 'destructive', title: 'Error', description: msg });
    } finally {
      setProcessing(false);
    }
  };

  if (isProcessing) {
    return <LoadingSpinner isOverlay text={t('processingText', 'Processing...')} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className={`mx-auto w-16 h-16 ${portalConfig.iconBg} rounded-full flex items-center justify-center mb-4`}>
              <Icon className={`w-10 h-10 ${portalConfig.iconColor}`} />
            </div>
            <CardTitle className="text-center text-2xl">
              {t('loginToAccount', 'Login to your account')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('doctorLoginDescription', 'Access your doctor portal')}
            </CardDescription>
            <div className="text-center">
              <Button variant="link" onClick={() => router.push(portalConfig.signupRoute)} className="text-sm">
                {t('dontHaveAccount', "Don't have an account?")} {t('signup', 'Sign Up')}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email', 'Email')}</Label>
                  <Input id="email" type="email" placeholder="doctor@hospital.com" {...register('email')} autoComplete="email" />
                  {errors.email && (<p className="text-sm text-destructive">{errors.email.message}</p>)}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('password', 'Password')}</Label>
                    <Button type="button" variant="link" className="px-0 text-sm" onClick={() => router.push('/forgot-password')}>
                      {t('forgotPassword', 'Forgot password?')}
                    </Button>
                  </div>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')} autoComplete="current-password" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (<p className="text-sm text-destructive">{errors.password.message}</p>)}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" checked={watch('rememberMe')} onCheckedChange={(checked: boolean) => setValue('rememberMe', checked as boolean)} />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">{t('rememberMe', 'Remember me')}</Label>
                </div>

                {error && (
                  <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {t('login', 'Login')}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/') }>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back', 'Back to Home')}
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer translations={translations} selectedLanguage={selectedLanguage} />
    </div>
  );
}
