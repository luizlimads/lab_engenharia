'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/auth';
import { apiClient } from '@/services/apiClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      AuthService.setToken(data.access_token);
      AuthService.setUser({
        email: data.email,
        userId: data.userId,
      });
      router.push('/sistema');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/background.avif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

      <Card className="relative z-10 w-full max-w-sm space-y-6 p-6 shadow-lg">
        <CardHeader className="p-0">
          <CardTitle className="text-center text-xl font-semibold">
            Food Stock
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Controle de estoque
          </p>
        </CardHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@exemplo.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#0F172A] text-white hover:bg-[#1e293b]"
            disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
