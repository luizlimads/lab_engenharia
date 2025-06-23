'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Box, Package, CheckCircle, XCircle, Layers, Snowflake, Milk, Bean } from 'lucide-react';
import { apiClient } from '@/services/apiClient';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DataTable } from './estoque/data-table';
import { minQuantityColumns, LowInventoryProduct } from './estoque/minQuantityColumns';

interface Overview {
	quantidade_total_itens: number;
	total_nomes_distintos: number;
	quantidade_por_categoria: { categoria: string; qtd_distinta: number }[];
	quantidade_validos: number;
	quantidade_invalidos: number;
}

export default function ProdutosDashboard() {
	const [overview, setOverview] = useState<Overview | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// expiring and low inventory are not available in backend, set as empty
	const [expiring, setExpiring] = useState<any[]>([]);
	const [expiringLoading, setExpiringLoading] = useState(false);
	const [expiringError, setExpiringError] = useState<string | null>(null);
	const [lowInventoryProducts, setLowInventoryProducts] = useState<any[]>([]);
	const [lowInventoryLoading, setLowInventoryLoading] = useState(false);
	const [lowInventoryError, setLowInventoryError] = useState<string | null>(null);
	const [days, setDays] = useState('7');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await apiClient('/api/produtos/summary/', {
					method: 'GET',
				});
				setOverview(data);
			} catch (error) {
				setError('Erro ao buscar produtos');
				console.error('Erro ao buscar produtos:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// expiring and low inventory are not available, so skip fetching

	if (loading) {
		return (
			<>
				<h1 className="text-3xl font-bold">Visão geral</h1>
				<div className="p-4">
					<p>Carregando dados...</p>
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<h1 className="text-3xl font-bold">Visão geral</h1>
				<div className="p-4">
					<Alert variant="destructive" className="flex items-center space-x-2">
						<XCircle className="text-destructive h-5 w-5" />
						<div>
							<AlertTitle>Erro ao carregar</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</div>
					</Alert>
				</div>
			</>
		);
	}

	if (!overview) return null;

	// Map backend fields to cards
	const cards = [
		{
			title: 'Total de itens',
			value: overview.quantidade_total_itens,
			icon: Package,
		},
		{
			title: 'Produtos distintos',
			value: overview.total_nomes_distintos,
			icon: Layers,
		},
		{
			title: 'Válidos',
			value: overview.quantidade_validos,
			icon: CheckCircle,
		},
		{
			title: 'Vencidos',
			value: overview.quantidade_invalidos,
			icon: XCircle,
		},
		// Categoria breakdown (if available)
		...(overview.quantidade_por_categoria || []).map((cat, idx) => ({
			title: `Categoria: ${cat.categoria}`,
			value: cat.qtd_distinta,
			icon: Bean,
		})),
	];

	return (
		<>
			<h1 className="text-3xl font-bold">Visão geral</h1>
			<div className="block">
				<div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{cards.map(({ title, value, icon: Icon }, idx) => (
						<Card key={title + idx} className="flex min-h-[100px] flex-col justify-center p-3">
							<Icon className="text-primary mb-1 h-4 w-4" />
							<div>
								<p className="text-muted-foreground text-xs leading-tight font-medium">{title}</p>
								<p className="text-base font-semibold">{value}</p>
							</div>
						</Card>
					))}
				</div>
			</div>
			<h2 className="text-2xl font-semibold">Próximos ao vencimento</h2>
			<div className="p-4">
				<p>Não disponível.</p>
			</div>
			<h2 className="text-2xl font-semibold">Alertas de disponibilidade</h2>
			<div className="p-4">
				<p>Não disponível.</p>
			</div>
		</>
	);
}
