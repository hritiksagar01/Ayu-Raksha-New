// src/app/patient/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { patientSignupSchema, type PatientSignupFormData } from '@/lib/validations/auth'; // ✅ Updated import
import { PORTAL_CONFIGS } from '@/config/portals.config';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const portalConfig = PORTAL_CONFIGS.patient;

export default function PatientSignupPage() {
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

  const handleGoogleSignup = async () => {
    setProcessing(true);
    try {
      setTimeout(() => {
        const mockGoogleResponse = {
          name: 'Test User',
          email: 'test@gmail.com',
          picture: 'https://via.placeholder.com/150',
          sub: 'google_' + Date.now(),
        };

        authApi
          .googleSignup(
            {
              name: mockGoogleResponse.name,
              email: mockGoogleResponse.email,
              avatar: mockGoogleResponse.picture,
              googleId: mockGoogleResponse.sub,
            },
            portalConfig.id
          )
          .then((response) => {
            if (response.success) {
              setUser(response.data.user);
              toast({
                title: 'Success!',
                description: 'Account created with Google!',
              });
              setTimeout(() => router.push(portalConfig.dashboardRoute), 1500);
            } else {
              toast({
                variant: 'destructive',
                title: 'Error',
                description: response.error || 'Google signup failed',
              });
            }
          })
          .finally(() => setProcessing(false));
      }, 1500);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign up with Google',
      });
      setProcessing(false);
    }
  };

  const onSubmit = async (data: PatientSignupFormData) => {
    console.log('📝 Signup Form Data:', data);
    
    setError('');
    setProcessing(true);

    try {
      const response = await authApi.signup(data, portalConfig.id);

      console.log('✅ Signup Response:', response);

      if (response.success) {
        setUser(response.data.user);
        toast({
          title: 'Success!',
          description: t('signupSuccess', 'Account created successfully!'),
        });
        setTimeout(() => router.push(portalConfig.dashboardRoute), 1500);
      } else {
        setError(response.error || 'Signup failed');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'Signup failed',
        });
      }
    } catch (err: any) {
      console.error('❌ Signup Error:', err);
      const errorMsg = err.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
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
              {t('signupDescription', 'Enter your details below to create your account')}
            </CardDescription>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => router.push(portalConfig.loginRoute)}
                className="text-sm"
              >
                {t('alreadyHaveAccount', 'Already have an account?')} {t('login', 'Login')}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('fullName', 'Full Name')}</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...form.register('name')}
                    disabled={isProcessing}
                    autoComplete="name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email', 'Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...form.register('email')}
                    disabled={isProcessing}
                    autoComplete="email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('password', 'Password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...form.register('password')}
                      disabled={isProcessing}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword', 'Confirm Password')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...form.register('confirmPassword')}
                      disabled={isProcessing}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t('phone', 'Phone Number (Optional)')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    {...form.register('phone')}
                    disabled={isProcessing}
                    autoComplete="tel"
                  />
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">{t('dateOfBirth', 'Date of Birth (Optional)')}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...form.register('dateOfBirth')}
                      disabled={isProcessing}
                      autoComplete="bday"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="gender">{t('gender', 'Gender (Optional)')}</Label>
                    <Select
                      onValueChange={(value) => form.setValue('gender', value as any)}
                      disabled={isProcessing}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('male', 'Male')}</SelectItem>
                        <SelectItem value="female">{t('female', 'Female')}</SelectItem>
                        <SelectItem value="other">{t('other', 'Other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={form.watch('acceptTerms')}
                    onCheckedChange={(checked) => form.setValue('acceptTerms', checked as boolean)}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed cursor-pointer">
                    {t('iAccept', 'I accept the')}{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      {t('termsAndConditions', 'Terms and Conditions')}
                    </a>
                  </Label>
                </div>
                {form.formState.errors.acceptTerms && (
                  <p className="text-sm text-destructive">{form.formState.errors.acceptTerms.message}</p>
                )}

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Creating Account...' : t('signup', 'Create Account')}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('orContinueWith', 'Or continue with')}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
              disabled={isProcessing}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('signupWithGoogle', 'Sign up with Google')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/')}
            >
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