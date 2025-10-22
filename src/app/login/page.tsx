"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { AuthManager } from "@/lib/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [forgotEmail, setForgotEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Timer para expiração do código
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Verificar se já está logado
  useEffect(() => {
    if (AuthManager.isAuthenticated()) {
      const redirect = searchParams.get('redirect') || '/';
      router.replace(redirect);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.login({ email, password });
      
      // Salvar dados no localStorage
      const user = response.client || response.user;
      if (user) {
        // Salvar dados de autenticação
        AuthManager.saveAuth(response.token, user);
        
        // Redirecionar para a página solicitada ou dashboard
        const redirect = searchParams.get('redirect') || '/';
        window.location.href = redirect;
      } else {
        throw new Error("Dados do usuário não encontrados");
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotStep('email');
    setError("");
    setSuccess("");
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiService.requestPasswordReset({ email: forgotEmail });
      setForgotStep('code');
      setTimeLeft(30);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao solicitar código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    if (timeLeft === 0) {
      setError('Código expirado. Solicite um novo código.');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verificar o código com o backend
      const response = await fetch('http://localhost:3333/sessions/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotEmail,
          code: code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido');
      }

      // Se o código for válido, avançar para a próxima etapa
      setForgotStep('newPassword');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await apiService.resetPassword({
        email: forgotEmail,
        code,
        newPassword,
      });
      
      setSuccess('Senha alterada com sucesso!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep('email');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setForgotEmail('');
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao resetar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotStep('email');
    setError("");
    setSuccess("");
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotEmail('');
  };

  const handleResendCode = () => {
    setForgotStep('email');
    setCode('');
    setTimeLeft(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/assets/logo-le.png"
              alt="LinkEats Logo"
              width={120}
              height={120}
              className="object-contain mb-4"
              priority
            />
            <h1 className="text-2xl font-bold text-gray-900">LinkEats</h1>
            <p className="text-gray-600 text-sm mt-2">Faça login em sua conta</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-700">{success}</span>
              </div>
            </div>
          )}

          {/* Form */}
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Forgot Password Flow */}
              {forgotStep === 'email' && (
                <form onSubmit={handleRequestCode} className="space-y-6">
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email para recuperação
                    </label>
                    <input
                      id="forgotEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {loading ? 'Enviando...' : 'Enviar Código'}
                  </button>
                </form>
              )}

              {forgotStep === 'code' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Código de Verificação
                    </label>
                    <div className="flex justify-center">
                      <InputOTP 
                        maxLength={6} 
                        value={code} 
                        onChange={(value) => setCode(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {timeLeft > 0 && (
                      <p className="mt-4 text-sm text-gray-500 text-center">
                        Código expira em: {timeLeft}s
                      </p>
                    )}
                    {timeLeft === 0 && (
                      <p className="mt-4 text-sm text-red-500 text-center">
                        Código expirado.{' '}
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-orange-500 hover:text-orange-600 font-medium"
                        >
                          Solicitar novo código
                        </button>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={code.length !== 6 || timeLeft === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Verificar Código
                  </button>
                </div>
              )}

              {forgotStep === 'newPassword' && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            {!showForgotPassword ? (
              <p className="text-sm text-gray-600">
                Esqueceu sua senha?{' '}
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Recuperar senha
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Lembrou da senha?{' '}
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Voltar ao login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 LinkEats. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}