'use client';

import { useState } from 'react';
import { Product } from '@/types/product.types';
import { Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

type SidebarCategory = {
  id: number;
  name: string;
  slug?: string | null;
  icon?: string;
  children?: SidebarCategory[];
  // Backward-compatible with existing dummy data shape
  subcategories?: Array<{
    name: string;
    link?: string;
  }>;
};

interface CategorySidebarProps {
  categories: SidebarCategory[] | { data?: SidebarCategory[] | null } | null | undefined;
  featuredProduct?: Product;
  className?: string;
}

export function CategorySidebar({
  categories,
  featuredProduct,
  className = '',
}: CategorySidebarProps) {
  const t = useTranslations('CategorySidebar');
  const categoryList: SidebarCategory[] = Array.isArray(categories)
    ? categories
    : categories?.data ?? [];

  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getCategoryHref = (category: SidebarCategory) =>
    `/categories/${category.slug ? category.slug : category.id}`;

  const renderTree = (nodes: SidebarCategory[], depth = 0) => {
    if (!nodes || nodes.length === 0) return null;

    return (
      <ul role={depth === 0 ? 'menu' : 'group'} className={depth === 0 ? 'py-2' : 'mt-1'}>
        {nodes.map((node) => {
          const children = node.children ?? [];
          const hasChildren = children.length > 0;
          const hasSubcategories = !!node.subcategories && node.subcategories.length > 0;
          const isExpandable = hasChildren || hasSubcategories;
          const isExpanded = expandedIds.has(node.id);

          return (
            <li key={node.id} role="none" className="px-2">
              <div
                className="flex items-center gap-2 rounded-xl transition-colors hover:bg-primary/5"
                style={{ paddingLeft: depth * 12 }}
              >
                <Button
                  variant="ghost"
                  className="h-auto min-w-0 flex-1 justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0f141a] hover:bg-transparent hover:text-primary dark:text-gray-200"
                  asChild
                >
                  <Link
                    href={getCategoryHref(node)}
                    aria-label={
                      isExpandable
                        ? t('aria.browseCategoryWithSubcategories', { name: node.name })
                        : t('aria.browseCategory', { name: node.name })
                    }
                    role="menuitem"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {/* <span className="shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-primary">
                        {node.icon || '•'}
                      </span> */}
                      <span className="truncate">{node.name}</span>
                    </span>
                  </Link>
                </Button>

                {isExpandable && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleExpanded(node.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-lg text-gray-400 hover:bg-transparent hover:text-primary"
                    aria-label={
                      isExpanded
                        ? t('aria.collapse', { name: node.name })
                        : t('aria.expand', { name: node.name })
                    }
                    aria-expanded={isExpanded}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90 text-primary' : ''}`}
                    />
                  </Button>
                )}
              </div>

              {hasChildren && isExpanded && (
                <div className="pb-1">{renderTree(children, depth + 1)}</div>
              )}

              {hasSubcategories && isExpanded && (
                <ul role="group" className="mt-1 pb-1">
                  {node.subcategories!.map((subcategory, index) => (
                    <li key={`${node.id}-sub-${index}`} role="none" className="px-2">
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-xl px-3 py-2 text-sm font-normal text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-gray-400 dark:hover:bg-[#3a3f45]"
                        asChild
                      >
                        <Link
                          href={subcategory.link || '#'}
                          role="menuitem"
                          style={{ paddingLeft: (depth + 1) * 12 }}
                        >
                          {subcategory.name}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className={`hidden lg:block col-span-3 ${className}`}>
      <div className="bg-white dark:bg-[#2d3238] rounded-2xl border border-[#e8edf2] dark:border-[#3a3f45] overflow-hidden sticky top-28">
        {/* Header */}
        <div className="p-5 border-b border-[#e8edf2] dark:border-[#3a3f45] bg-gray-50/50 dark:bg-[#32383f]">
          <h3 className="font-extrabold text-sm uppercase tracking-widest flex items-center gap-2 text-[#0f141a] dark:text-white">
            <Menu className="text-primary w-5 h-5" />
            {t('title')}
          </h3>
        </div>

        {/* Categories List */}
        <nav>{renderTree(categoryList)}</nav>


      </div>
    </aside>
  );
}

export default CategorySidebar;
