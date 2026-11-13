"use client";

import React, { useState, useEffect } from "react";
import {
  Utensils,
  Layers,
  Image as ImageIcon,
  Mail,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  Star,
  Eye,
  EyeOff,
  Search,
  MessageCircle,
  Phone,
  Send,
  Upload,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL } from "@/lib/utils";

const BRAND_IMAGE_PRESETS = [
  { label: "Mesa Brunch Compartilhada (Hero)", url: "/images/martita/mesa-brunch-compartilhada.jpg" },
  { label: "Bandeja Brunch Completa", url: "/images/martita/brunch-bandeja.jpg" },
  { label: "Café & Croissant Salgado", url: "/images/martita/cafe-croissant-salgado.jpg" },
  { label: "Croissant de Pistache", url: "/images/martita/croissant-pistache.jpg" },
  { label: "Croissant Nutella & Morangos", url: "/images/martita/croissant-nutella-morangos.jpg" },
  { label: "Croissant Banana & Doce de Leite", url: "/images/martita/croissant-banana-doce-de-leite.jpg" },
  { label: "Ovos, Bacon & Abacate (Close)", url: "/images/martita/ovos-bacon-abacate-close.jpg" },
  { label: "Ovos, Bacon & Abacate (Top)", url: "/images/martita/ovos-bacon-abacate-top.jpg" },
  { label: "Taça Café Especial & Caramelo", url: "/images/martita/cafe-especial-taca.jpg" },
  { label: "Aperol Spritz & Gastrobar", url: "/images/martita/drink-spritz-almondegas.jpg" },
  { label: "Risoto de Filé Mignon & Funghi", url: "/images/martita/risoto-file-funghi.jpg" },
  { label: "Fettuccine com Almôndegas", url: "/images/martita/fettuccine-almondegas.jpg" },
  { label: "Galeto ao Primo Canto", url: "/images/martita/galeto-primo-canto.jpg" },
  { label: "Hambúrguer na Panelinha", url: "/images/martita/hamburguer-panelinha.jpg" },
  { label: "Lomito na Baguete", url: "/images/martita/lomito-baguete.jpg" },
  { label: "Empanadas Argentinas Assadas", url: "/images/martita/empanadas-argentinas.jpg" },
  { label: "Sobremesa Morango & Torta", url: "/images/martita/sobremesa-morango-torta.jpg" },
  { label: "Tapiocas Doces & Salgadas", url: "/images/martita/tapiocas-doces-salgadas.jpg" },
  { label: "Ambiente Salão Martita", url: "/images/martita/ambiente-salao.jpg" },
];

interface SiteContentManagerProps {
  initialSubTab?: "products" | "categories" | "gallery" | "forms" | "pages";
  categories: any[];
  products: any[];
  gallery: any[];
  messages: any[];
  siteConfig: any;
  onRefreshData: () => Promise<void>;
  onShowNotice: (msg: string) => void;
}

export function SiteContentManager({
  initialSubTab = "products",
  categories,
  products,
  gallery,
  messages,
  siteConfig,
  onRefreshData,
  onShowNotice,
}: SiteContentManagerProps) {
  const [subTab, setSubTab] = useState(initialSubTab);

  useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Product Form
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    price: "",
    image: "/images/martita/cafe-croissant-salgado.jpg",
    badge: "",
    isFeatured: false,
    isAvailable: true,
    isDemo: false,
    order: 1,
    categoryId: categories[0]?.id || "",
  });

  // Category Form
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    subtitle: "",
    description: "",
    order: 1,
    active: true,
  });

  // Gallery Form
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    caption: "",
    category: "Gastronomia",
    image: "/images/martita/mesa-brunch-compartilhada.jpg",
    aspect: "portrait",
    order: 1,
  });

  // Site Identity Form
  const [configForm, setConfigForm] = useState<any>(siteConfig || {});

  // Product Actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: productForm.price ? parseFloat(String(productForm.price).replace(",", ".")) : null,
      };

      if (editingProduct) {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
        if (res.ok) {
          onShowNotice("Prato atualizado com sucesso!");
          setEditingProduct(null);
          onRefreshData();
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          onShowNotice("Prato cadastrado com sucesso!");
          setProductForm({
            name: "",
            description: "",
            ingredients: "",
            price: "",
            image: "/images/martita/cafe-croissant-salgado.jpg",
            badge: "",
            isFeatured: false,
            isAvailable: true,
            isDemo: false,
            order: 1,
            categoryId: categories[0]?.id || "",
          });
          onRefreshData();
        }
      }
    } catch {
      alert("Erro ao salvar prato.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Remover este prato do cardápio?")) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      onShowNotice("Prato removido.");
      onRefreshData();
    } catch {
      alert("Erro ao excluir.");
    }
  };

  const handleToggleProduct = async (prod: any, field: "isFeatured" | "isAvailable") => {
    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prod.id, [field]: !prod[field] }),
      });
      onShowNotice(`${prod.name} atualizado.`);
      onRefreshData();
    } catch {
      alert("Erro ao atualizar.");
    }
  };

  // Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...categoryForm }),
        });
        if (res.ok) {
          onShowNotice("Categoria atualizada!");
          setEditingCategory(null);
          onRefreshData();
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        });
        if (res.ok) {
          onShowNotice("Categoria criada!");
          setCategoryForm({ name: "", subtitle: "", description: "", order: 1, active: true });
          onRefreshData();
        }
      }
    } catch {
      alert("Erro ao salvar categoria.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Excluir esta categoria? Todos os pratos vinculados serão impactados.")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    onShowNotice("Categoria removida.");
    onRefreshData();
  };

  // Gallery Actions
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryForm),
      });
      if (res.ok) {
        onShowNotice("Foto adicionada à galeria!");
        setGalleryForm({
          title: "",
          caption: "",
          category: "Gastronomia",
          image: "/images/martita/mesa-brunch-compartilhada.jpg",
          aspect: "portrait",
          order: 1,
        });
        onRefreshData();
      }
    } catch {
      alert("Erro ao adicionar foto.");
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm("Remover foto da galeria?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    onShowNotice("Foto removida da galeria.");
    onRefreshData();
  };

  // Message Actions
  const handleMarkMessageRead = async (id: string) => {
    await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    onShowNotice("Mensagem marcada como lida.");
    onRefreshData();
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Excluir esta mensagem?")) return;
    await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
    onShowNotice("Mensagem excluída.");
    onRefreshData();
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryFilter === "all" || p.categoryId === selectedCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Subtab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#CFB583]/15">
        <div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#211A17]">
            Gestão de Conteúdo &amp; Experiência Gastronômica
          </h2>
          <p className="text-xs sm:text-sm text-[#38271F]/70 mt-1">
            Administre os pratos do cardápio vivo, categorias por turnos, fotos da galeria e mensagens enviadas pelos clientes.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "products", label: "Cardápio & Pratos", icon: Utensils, badge: products.length },
            { id: "categories", label: "Categorias", icon: Layers, badge: categories.length },
            { id: "gallery", label: "Galeria & Mídia", icon: ImageIcon, badge: gallery.length },
            { id: "forms", label: "Mensagens & Contatos", icon: Mail, badge: messages.filter((m) => !m.read).length || undefined },
            { id: "pages", label: "Textos da Marca", icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = subTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSubTab(item.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#211A17] text-[#CFB583] shadow-sm font-semibold"
                    : "bg-white/80 hover:bg-white text-[#38271F]/70 border border-[#CFB583]/20"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#CFB583]" : "text-[#38271F]/50"}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? "bg-[#CFB583] text-[#211A17]" : "bg-[#CFB583]/20 text-[#211A17]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: PRODUTOS & CARDÁPIO */}
      {subTab === "products" && (
        <div className="space-y-6">
          {/* Product Form Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
              {editingProduct ? `Editar Prato: ${editingProduct.name}` : "Cadastrar Novo Prato ou Drink"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Nome do Prato *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Croissant de Pistache & Framboesa"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Categoria *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="text"
                    placeholder="28,00"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Descrição Gastronômica *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Massa folhada de fermentação lenta com 100% manteiga francesa, recheio artesanal..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Ingredientes / Notas de Sabor
                  </label>
                  <input
                    type="text"
                    placeholder="Pistache iraniano, framboesas frescas, chocolate branco belga"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Badge de Destaque
                  </label>
                  <input
                    type="text"
                    placeholder="Queridinho, Autoral, Sem Glúten, Exclusivo"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-2">
                  Fotografia do Prato (Selecione do Ensaio Oficial ou Cole URL)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 rounded-2xl bg-[#F8F4EC]/60 border border-[#CFB583]/20">
                  {BRAND_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        productForm.image === preset.url
                          ? "border-[#E77759] scale-95 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <SafeImage src={preset.url} alt={preset.label} className="w-full h-full" imgClassName="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#211A17]">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-[#E77759] focus:ring-[#E77759]"
                  />
                  <span>Destaque na Página Inicial (Queridinhos)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#211A17]">
                  <input
                    type="checkbox"
                    checked={productForm.isAvailable}
                    onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    className="rounded text-[#E77759] focus:ring-[#E77759]"
                  />
                  <span>Disponível no Salão</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#CFB583]/15">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        description: "",
                        ingredients: "",
                        price: "",
                        image: "/images/martita/cafe-croissant-salgado.jpg",
                        badge: "",
                        isFeatured: false,
                        isAvailable: true,
                        isDemo: false,
                        order: 1,
                        categoryId: categories[0]?.id || "",
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl border border-[#CFB583]/30 text-xs font-medium text-[#211A17] hover:bg-[#F8F4EC] transition-colors"
                  >
                    Cancelar Edição
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? "Salvar Alterações" : "Adicionar Prato"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Products Filter & List */}
          <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CFB583]/15">
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/60 focus:outline-none"
                >
                  <option value="all">Todas as Categorias ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#38271F]/50 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar prato..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/60 focus:outline-none"
                  />
                </div>
              </div>

              <span className="text-xs font-mono text-[#38271F]/60">
                {filteredProducts.length} prato(s) exibido(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-[#F8F4EC]/40 border border-[#CFB583]/20 hover:border-[#CFB583]/40 transition-all flex flex-col justify-between group"
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#CFB583]/30">
                      <SafeImage src={p.image} alt={p.name} className="w-full h-full" imgClassName="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif-editorial text-base font-semibold text-[#211A17] truncate">
                          {p.name}
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#E77759] shrink-0">
                          {p.price ? formatBRL(p.price) : "Sob Consulta"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#38271F]/70 line-clamp-2 mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#CFB583]/15 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleProduct(p, "isFeatured")}
                        title={p.isFeatured ? "Remover dos Queridinhos" : "Marcar como Queridinho"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.isFeatured ? "text-amber-500 bg-amber-50" : "text-[#38271F]/40 hover:text-amber-500"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => handleToggleProduct(p, "isAvailable")}
                        title={p.isAvailable ? "Pausar vendas" : "Ativar no cardápio"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.isAvailable ? "text-emerald-600 bg-emerald-50" : "text-red-400 bg-red-50"
                        }`}
                      >
                        {p.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductForm({
                            name: p.name,
                            description: p.description,
                            ingredients: p.ingredients || "",
                            price: p.price ? String(p.price) : "",
                            image: p.image,
                            badge: p.badge || "",
                            isFeatured: p.isFeatured,
                            isAvailable: p.isAvailable,
                            isDemo: p.isDemo,
                            order: p.order,
                            categoryId: p.categoryId,
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-1.5 rounded-lg text-[#38271F]/60 hover:text-[#211A17] hover:bg-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CATEGORIAS */}
      {subTab === "categories" && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
              {editingCategory ? `Editar Categoria: ${editingCategory.name}` : "Criar Nova Categoria"}
            </h3>

            <form onSubmit={handleSaveCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cafés Especiais, Brunch, Gastrobar"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Subtítulo / Turno
                </label>
                <input
                  type="text"
                  placeholder="Manhã & Tarde, Noite, Sobremesas"
                  value={categoryForm.subtitle}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? "Atualizar" : "Salvar Categoria"}</span>
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: "", subtitle: "", description: "", order: 1, active: true });
                    }}
                    className="py-2.5 px-3 rounded-xl border border-[#CFB583]/30 text-xs text-[#211A17] hover:bg-[#F8F4EC]"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Categorias Existentes
            </h3>

            <div className="divide-y divide-[#CFB583]/10">
              {categories.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#211A17]">{c.name}</h4>
                    <p className="text-xs text-[#38271F]/60 font-mono">slug: {c.slug} • {c.subtitle || "Sem subtítulo"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setCategoryForm({
                          name: c.name,
                          subtitle: c.subtitle || "",
                          description: c.description || "",
                          order: c.order,
                          active: c.active,
                        });
                      }}
                      className="p-1.5 rounded-lg text-[#38271F]/60 hover:text-[#211A17] hover:bg-[#F8F4EC]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: GALERIA & MÍDIA */}
      {subTab === "gallery" && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
              Adicionar Foto à Galeria Imersiva
            </h3>

            <form onSubmit={handleSaveGalleryItem} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">Título *</label>
                <input
                  type="text"
                  required
                  placeholder="Café Especial & Caramelo"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">Categoria</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                >
                  <option value="Gastronomia">Gastronomia</option>
                  <option value="Cafés">Cafés Especiais</option>
                  <option value="Drinks">Drinks &amp; Coquetéis</option>
                  <option value="Sobremesas">Sobremesas</option>
                  <option value="Ambiente">Ambiente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">Formato Visual</label>
                <select
                  value={galleryForm.aspect}
                  onChange={(e) => setGalleryForm({ ...galleryForm, aspect: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                >
                  <option value="portrait">Vertical (3:4)</option>
                  <option value="landscape">Horizontal (4:3)</option>
                  <option value="square">Quadrado (1:1)</option>
                  <option value="wide">Panorâmico (16:9)</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Imagem</span>
                </button>
              </div>
            </form>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-[#CFB583]/30 aspect-square">
                <SafeImage src={item.image} alt={item.title} className="w-full h-full" imgClassName="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                  <span className="font-semibold">{item.title}</span>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MENSAGENS E CONTATOS */}
      {subTab === "forms" && (
        <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
            Mensagens Recebidas pelo Site
          </h3>

          <div className="divide-y divide-[#CFB583]/10">
            {messages.map((m) => (
              <div key={m.id} className={`py-4 space-y-2 ${m.read ? "opacity-70" : "bg-white font-medium"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#211A17]">{m.name}</span>
                    {!m.read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#E77759] text-white">
                        Novo
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#38271F]/50">
                    {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <p className="text-xs text-[#38271F]/80 leading-relaxed bg-[#F8F4EC]/60 p-3 rounded-xl border border-[#CFB583]/20">
                  {m.message}
                </p>

                <div className="flex items-center justify-between text-xs text-[#38271F]/60">
                  <span>{m.email} {m.phone ? `• ${m.phone}` : ""}</span>
                  <div className="flex items-center gap-2">
                    {!m.read && (
                      <button
                        onClick={() => handleMarkMessageRead(m.id)}
                        className="px-2.5 py-1 rounded-lg border border-[#CFB583]/30 hover:bg-[#F8F4EC] text-[11px]"
                      >
                        Marcar como lida
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="p-1 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="py-8 text-center text-xs text-[#38271F]/50 font-mono">
                Nenhuma mensagem de contato recebida até o momento.
              </p>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 5: TEXTOS DA MARCA */}
      {subTab === "pages" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
            Textos Editoriais da Página Inicial
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#211A17] mb-1">
                Headline da Hero Section
              </label>
              <input
                type="text"
                defaultValue={siteConfig?.heroHeadline || "Um lugar para saborear cada momento."}
                id="cfg_heroHeadline"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211A17] mb-1">
                Subtítulo da Hero Section
              </label>
              <textarea
                rows={2}
                defaultValue={siteConfig?.heroSubheadline || ""}
                id="cfg_heroSubheadline"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211A17] mb-1">
                Frase de Destaque da Nossa Essência
              </label>
              <input
                type="text"
                defaultValue={siteConfig?.essenceQuote || "Onde as histórias ficam melhores depois de um drinque."}
                id="cfg_essenceQuote"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#CFB583]/15">
              <button
                type="button"
                onClick={async () => {
                  const heroHeadline = (document.getElementById("cfg_heroHeadline") as HTMLInputElement)?.value;
                  const heroSubheadline = (document.getElementById("cfg_heroSubheadline") as HTMLTextAreaElement)?.value;
                  const essenceQuote = (document.getElementById("cfg_essenceQuote") as HTMLInputElement)?.value;
                  await fetch("/api/site", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ heroHeadline, heroSubheadline, essenceQuote }),
                  });
                  onShowNotice("Textos da marca atualizados com sucesso!");
                  onRefreshData();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Textos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
