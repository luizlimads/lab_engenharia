'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  User2,
  BookOpen,
  Boxes,
  ArrowRightLeft,
  LayoutDashboard,
  ScanBarcode,
  List,
  Search,
  Cylinder,
  CircleX,
  CircleCheck,
  CirclePlus,
  History,
  Settings,
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
import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

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
        title: 'Relatórios',
        url: '/sistema/estoque/relatorios',
        icon: BookOpen,
      },
    ],
  },
  {
    title: 'Movimentações',
    url: '/sistema/movimentacoes',
    icon: ArrowRightLeft,
    children: [
      {
        title: 'Reabastecimento',
        url: '/sistema/movimentacoes/reabastecimento',
        icon: CirclePlus,
      },
      {
        title: 'Consumo ou descarte',
        url: '/sistema/movimentacoes/consumo',
        icon: CircleX,
      },

      {
        title: 'Histórico',
        url: '/sistema/movimentacoes/historico',
        icon: History,
      },
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
                              isParentActive
                                ? 'bg-gray-100 font-semibold dark:bg-gray-700'
                                : ''
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
                                          ? 'bg-gray-200 font-semibold dark:bg-gray-600'
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
                            ? 'bg-gray-100 font-semibold dark:bg-gray-700'
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
        <div>
          <ModeToggle />
          <a href="/sistema/configuracoes">
            <Button variant="outline" size="icon">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={
                    pathname.startsWith('/profile')
                      ? 'bg-gray-100 font-semibold dark:bg-gray-700'
                      : ''
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
