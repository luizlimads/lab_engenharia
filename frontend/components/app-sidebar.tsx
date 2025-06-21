'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  Settings,
  ChevronDown,
  User,
  Shield,
  ChevronUp,
  User2,
  BookOpen,
  Boxes,
  ArrowRightLeft,
  LayoutDashboard,
  ScanBarcode,
  List,
  Search,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { AuthService } from '@/services/auth';

interface SidebarMenuChild {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface SidebarMenuItemType {
  title: string;
  url: string;
  icon: React.ElementType;
  children?: SidebarMenuChild[];
}

function logout() {
  AuthService.logout();
}

const items: SidebarMenuItemType[] = [
  { title: 'Visão geral', url: '/sistema', icon: LayoutDashboard },
  {
    title: 'Estoque',
    url: '/sistema/estoque',
    icon: Boxes,
    children: [
      { title: 'Listar', url: '/sistema/estoque', icon: List },
      { title: 'Pesquisar', url: '/sistema/estoque/pesquisar', icon: Search },
      {
        title: 'Cadastrar', url: '/sistema/estoque/cadastrar',icon: ScanBarcode},
      { title: 'Relatórios', url: '/sistema/estoque/relatorios', icon: BookOpen,},
    ],
  },
  {
    title: 'Movimentações',
    url: '/sistema/movimentacoes',
    icon: ArrowRightLeft,
    children: [
      { title: 'Compras', url: '/sistema/movimentacoes/compras', icon: List },
      { title: 'Descarte', url: '/sistema/movimentacoes/descarte', icon: Search },
      {
        title: 'Reabastecimento', url: '/sistema/movimentacoes/reabastecimento',icon: ScanBarcode},
      { title: 'Saidas', url: '/sistema/movimentacoes/saidas', icon: BookOpen,},
    ],
   },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = AuthService.getUser()?.email ?? null;
    setUserEmail(email);
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Food Stock</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const isParentActive =
                  pathname === item.url ||
                  item.children?.some((c) => pathname === c.url);
                if (item.children) {
                  return (
                    <Collapsible key={item.title} defaultOpen={isParentActive}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`group/collapsible flex w-full items-center justify-between ${
                              isParentActive ? 'bg-gray-100 font-semibold' : ''
                            }`}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => {
                              const SubIcon = child.icon;
                              const isActive = pathname === child.url;
                              return (
                                <SidebarMenuSubItem key={child.title}>
                                  <SidebarMenuButton asChild>
                                    <a
                                      href={child.url}
                                      className={`flex items-center gap-2 rounded px-2 py-1 ${
                                        isActive
                                          ? 'bg-gray-200 font-semibold'
                                          : ''
                                      }`}>
                                      <SubIcon className="h-4 w-4" />
                                      <span>{child.title}</span>
                                    </a>
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 rounded px-2 py-1 ${
                          pathname === item.url
                            ? 'bg-gray-100 font-semibold'
                            : ''
                        }`}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={
                    pathname.startsWith('/profile') ? 'bg-gray-100' : ''
                  }>
                  <User2 />
                  <span>{userEmail ?? 'Usuário desconhecido'}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
