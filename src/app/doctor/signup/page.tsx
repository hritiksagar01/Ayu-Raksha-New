'use client';

import { useState } from 'react';
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
import { patientSignupSchema, type PatientSignupFormData } from '@/lib/validations/auth';
import { PORTAL_CONFIGS } from '@/config/portals.config';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const portalConfig = PORTAL_CONFIGS.doctor;

export default function DoctorSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedLanguage, setUser, setProcessing, isProcessing } = useStore();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const Icon = portalConfig.icon;

  const form = useForm<PatientSignupFormData>({
    resolver: zodResolver(patientSignupSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: undefined,
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: PatientSignupFormData) => {
    setError('');
    setProcessing(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastPortal', portalConfig.id);
      }

      const response = await authApi.supabaseSignup(data, portalConfig.id);

      if (response.success && response.data?.token) {
        setUser(response.data.user);
        toast({ title: 'Success!', description: t('signupSuccess', 'Account created successfully!') });
        setTimeout(() => router.push(portalConfig.dashboardRoute), 1200);
      } else if (response.success && !response.data?.token) {
        toast({ title: 'Check your email', description: 'We\'ve sent you a confirmation link. Click it to finish sign-in.' });
      } else {
        const msg = response.error || 'Signup failed';
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
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className={`mx-auto w-16 h-16 ${portalConfig.iconBg} rounded-full flex items-center justify-center mb-4`}>
              <Icon className={`w-10 h-10 ${portalConfig.iconColor}`} />
            </div>
            <CardTitle className="text-center text-2xl">
              {t('createAccount', 'Create your account')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('doctorSignupDescription', 'Register to access the doctor portal')}
            </CardDescription>
            <div className="text-center">
              <Button variant="link" onClick={() => router.push(portalConfig.loginRoute)} className="text-sm">
                {t('alreadyHaveAccount', 'Already have an account?')} {t('login', 'Login')}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('fullName', 'Full Name')}</Label>
                  <Input id="name" placeholder="Dr. John Doe" {...form.register('name')} autoComplete="name" />
                  {form.formState.errors.name && (<p className="text-sm text-destructive">{form.formState.errors.name.message}</p>)}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email', 'Email')}</Label>
                  <Input id="email" type="email" placeholder="doctor@hospital.com" {...form.register('email')} autoComplete="email" />
                  {form.formState.errors.email && (<p className="text-sm text-destructive">{form.formState.errors.email.message}</p>)}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">{t('password', 'Password')}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...form.register('password')} autoComplete="new-password" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.password && (<p className="text-sm text-destructive">{form.formState.errors.password.message}</p>)}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword', 'Confirm Password')}</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" {...form.register('confirmPassword')} autoComplete="new-password" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.confirmPassword && (<p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>)}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="acceptTerms" checked={form.watch('acceptTerms')} onCheckedChange={(checked: boolean) => form.setValue('acceptTerms', checked as boolean)} />
                  <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed cursor-pointer">
                    {t('iAccept', 'I accept the')} <a href="/terms" className="text-primary hover:underline">{t('termsAndConditions', 'Terms and Conditions')}</a>
                  </Label>
                </div>
                {form.formState.errors.acceptTerms && (<p className="text-sm text-destructive">{form.formState.errors.acceptTerms.message}</p>)}

                {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {isProcessing ? t('creatingAccount', 'Creating Account...') : t('createAccount', 'Create Account')}
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
