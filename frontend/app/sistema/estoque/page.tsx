"use client";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { DataTable } from "@/app/sistema/estoque/data-table";
import { columns } from "@/app/sistema/estoque/columns";
import { apiClient } from "@/services/apiClient";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from the correct backend endpoint
        const produtosData = await apiClient("/produtos/all/", {
          method: "GET",
        });
        setProdutos(produtosData);
      } catch (error) {
        setError("Erro ao buscar produtos");
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="text-3xl font-bold">Estoque</h1>
        <div className="p-4">
          <p>Carregando dados...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="text-3xl font-bold">Estoque</h1>
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
  return (
    <>
      <h1 className="text-3xl font-bold">Estoque</h1>
      <div className="mt-4">
        <DataTable columns={columns} data={produtos} />
      </div>
    </>
  );
};

export default ProdutosPage;
