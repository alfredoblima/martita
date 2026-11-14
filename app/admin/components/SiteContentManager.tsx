"use client";

import React, { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  X,
  Maximize2,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL } from "@/lib/utils";

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function formatFileNameToTitle(fileName: string): string {
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
  return nameWithoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

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

  // Gallery Form & Upload States
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    caption: "",
    category: "Gastronomia",
    image: "",
    aspect: "portrait",
    order: 1,
  });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryUploadStatus, setGalleryUploadStatus] = useState<
    "idle" | "selected" | "uploading" | "optimizing" | "success" | "error"
  >("idle");
  const [galleryStatusMessage, setGalleryStatusMessage] = useState<string>("");
  const [galleryFilterCategory, setGalleryFilterCategory] = useState<string>("Todas");
  const [gallerySearchQuery, setGallerySearchQuery] = useState<string>("");
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Gallery Modals & Replace States
  const [viewingGalleryItem, setViewingGalleryItem] = useState<any | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<any | null>(null);
  const [replacingGalleryItem, setReplacingGalleryItem] = useState<any | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Gallery Actions & Handlers
  const handleSelectGalleryFile = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      setGalleryUploadStatus("error");
      setGalleryStatusMessage(
        `Arquivo muito grande (${(file.size / (1024 * 1024)).toFixed(1)} MB). O limite máximo é 15 MB.`
      );
      return;
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isValid = file.type.startsWith("image/") || validExtensions.includes(ext);

    if (!isValid) {
      setGalleryUploadStatus("error");
      setGalleryStatusMessage("Formato não suportado. Utilize imagens JPG, PNG, WEBP ou HEIC.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setGalleryFile(file);
    setGalleryPreview(previewUrl);
    setGalleryUploadStatus("selected");
    setGalleryStatusMessage("Imagem pronta para otimização e envio.");

    // Auto-detect aspect ratio from loaded image
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      let detectedAspect = "portrait";
      if (ratio >= 1.6) detectedAspect = "wide";
      else if (ratio >= 1.15) detectedAspect = "landscape";
      else if (ratio >= 0.85) detectedAspect = "square";

      setGalleryForm((prev) => ({
        ...prev,
        aspect: detectedAspect,
        title: prev.title || formatFileNameToTitle(file.name),
      }));
    };
    img.src = previewUrl;
  };

  const handleClearGalleryFile = () => {
    if (galleryPreview) {
      URL.revokeObjectURL(galleryPreview);
    }
    setGalleryFile(null);
    setGalleryPreview(null);
    setGalleryUploadStatus("idle");
    setGalleryStatusMessage("");
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = "";
    }
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!galleryFile && !galleryForm.image) {
      setGalleryUploadStatus("error");
      setGalleryStatusMessage("Selecione uma imagem para cadastrar na galeria.");
      return;
    }

    try {
      setGalleryUploadStatus("uploading");
      setGalleryStatusMessage("Enviando arquivo original...");

      if (galleryFile) {
        setTimeout(() => {
          setGalleryUploadStatus("optimizing");
          setGalleryStatusMessage("Otimizando com Sharp: correção EXIF e conversão WebP (q82)...");
        }, 300);

        const formData = new FormData();
        formData.append("file", galleryFile);
        formData.append("title", galleryForm.title);
        formData.append("caption", galleryForm.caption || "");
        formData.append("category", galleryForm.category);
        formData.append("aspect", galleryForm.aspect);
        formData.append("order", String(galleryForm.order || 0));
        formData.append("active", "true");

        const res = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Erro ao adicionar imagem na galeria.");
        }

        setGalleryUploadStatus("success");
        setGalleryStatusMessage("Imagem otimizada em WebP adicionada com sucesso!");
        onShowNotice("Foto otimizada em WebP adicionada à galeria!");
        handleClearGalleryFile();
        setGalleryForm({
          title: "",
          caption: "",
          category: "Gastronomia",
          image: "",
          aspect: "portrait",
          order: 1,
        });
        setTimeout(() => {
          setGalleryUploadStatus("idle");
          setGalleryStatusMessage("");
        }, 3500);
        onRefreshData();
      } else {
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
            image: "",
            aspect: "portrait",
            order: 1,
          });
          onRefreshData();
        }
      }
    } catch (err: any) {
      setGalleryUploadStatus("error");
      setGalleryStatusMessage(err.message || "Erro ao adicionar foto.");
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (
      !confirm(
        "Tem certeza que deseja remover esta foto da galeria? O arquivo correspondente também será apagado do armazenamento."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        onShowNotice("Foto e arquivo removidos da galeria.");
        if (viewingGalleryItem?.id === id) setViewingGalleryItem(null);
        if (editingGalleryItem?.id === id) setEditingGalleryItem(null);
        if (replacingGalleryItem?.id === id) setReplacingGalleryItem(null);
        onRefreshData();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao remover foto.");
      }
    } catch {
      alert("Erro ao remover foto.");
    }
  };

  const handleUpdateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;

    try {
      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGalleryItem),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar item da galeria.");
      }

      onShowNotice("Informações da foto atualizadas!");
      setEditingGalleryItem(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar foto.");
    }
  };

  const handleSelectReplaceFile = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      alert(`Arquivo muito grande (${(file.size / (1024 * 1024)).toFixed(1)} MB). O limite é 15 MB.`);
      return;
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isValid = file.type.startsWith("image/") || validExtensions.includes(ext);

    if (!isValid) {
      alert("Formato não suportado. Utilize imagens JPG, PNG, WEBP ou HEIC.");
      return;
    }

    setReplaceFile(file);
    setReplacePreview(URL.createObjectURL(file));
  };

  const handleConfirmReplaceImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingGalleryItem || !replaceFile) return;

    try {
      setIsReplacing(true);
      const formData = new FormData();
      formData.append("id", replacingGalleryItem.id);
      formData.append("file", replaceFile);
      formData.append("title", replacingGalleryItem.title);

      const res = await fetch("/api/gallery", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao substituir imagem.");
      }

      onShowNotice("Imagem substituída com sucesso por nova versão WebP otimizada!");
      setReplacingGalleryItem(null);
      setReplaceFile(null);
      setReplacePreview(null);
      setIsReplacing(false);
      onRefreshData();
    } catch (err: any) {
      setIsReplacing(false);
      alert(err.message || "Erro ao substituir imagem.");
    }
  };

  const handleCopyImageUrl = (item: any) => {
    if (!item?.image) return;
    const fullUrl = item.image.startsWith("http")
      ? item.image
      : `${window.location.origin}${item.image}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrlId(item.id);
    setTimeout(() => setCopiedUrlId(null), 2000);
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
        <div className="space-y-8">
          {/* Top Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#38271F]/60 font-semibold">
                  Total de Fotos na Galeria
                </span>
                <p className="font-serif-editorial text-2xl font-bold text-[#211A17] mt-1">
                  {gallery.length} fotos
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#F8F4EC] border border-[#CFB583]/30 flex items-center justify-center text-[#211A17]">
                <ImageIcon className="w-5 h-5 text-[#CFB583]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#38271F]/60 font-semibold">
                  Otimizadas em WebP
                </span>
                <p className="font-serif-editorial text-2xl font-bold text-[#211A17] mt-1 flex items-center gap-2">
                  <span>
                    {gallery.filter((i) => i.mimeType === "image/webp" || i.image?.endsWith(".webp")).length}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-medium">
                    100% WebP
                  </span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#38271F]/60 font-semibold">
                  Processador de Otimização
                </span>
                <p className="font-serif-editorial text-2xl font-bold text-[#211A17] mt-1">
                  Sharp v0.35
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Qualidade 82% • Rotação EXIF • Max 2560px
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#211A17] flex items-center justify-center text-[#CFB583]">
                <Layers className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Upload & Registration Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CFB583]/15 pb-4">
              <div>
                <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
                  Adicionar Foto à Galeria Imersiva
                </h3>
                <p className="text-xs text-[#38271F]/70 mt-0.5">
                  Faça upload de fotos direto do seu computador ou celular. O sistema otimiza dimensões, corrige rotação EXIF e converte automaticamente para WebP de alto desempenho.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#F8F4EC] text-[#211A17] border border-[#CFB583]/30 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#CFB583]" />
                Conversão Automática WebP
              </span>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-6">
              {/* Drag and Drop Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-2">
                  Arquivo de Imagem *
                </label>

                <input
                  type="file"
                  ref={galleryFileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSelectGalleryFile(e.target.files[0]);
                    }
                  }}
                />

                {!galleryFile && !galleryPreview ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleSelectGalleryFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                      isDragging
                        ? "border-[#CFB583] bg-[#EFE5D5]/70 scale-[1.01]"
                        : "border-[#CFB583]/40 bg-[#F8F4EC]/50 hover:bg-[#F8F4EC] hover:border-[#CFB583]"
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-[#CFB583]/30 flex items-center justify-center text-[#211A17] shadow-sm mb-3">
                      <Upload className="w-6 h-6 text-[#CFB583]" />
                    </div>
                    <p className="text-sm font-semibold text-[#211A17]">
                      Arraste e solte uma imagem aqui, ou clique para selecionar
                    </p>
                    <p className="text-xs text-[#38271F]/60 mt-1">
                      Suporta arquivos JPG, JPEG, PNG, WEBP e HEIC de até 15 MB
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white border border-[#CFB583]/30 text-[#38271F]/80">
                        JPG / JPEG
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white border border-[#CFB583]/30 text-[#38271F]/80">
                        PNG
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white border border-[#CFB583]/30 text-[#38271F]/80">
                        WEBP
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white border border-[#CFB583]/30 text-[#38271F]/80">
                        HEIC (iPhone)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F4EC]/60 border border-[#CFB583]/35 flex flex-col sm:flex-row items-center gap-5">
                    {/* Thumbnail Preview */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#CFB583]/40 bg-black shrink-0 shadow-sm">
                      <img
                        src={galleryPreview || ""}
                        alt="Pré-visualização"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/75 text-[#CFB583]">
                        {galleryForm.aspect}
                      </span>
                    </div>

                    {/* File Meta & Controls */}
                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Imagem Selecionada
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-[#38271F] border border-[#CFB583]/30">
                          {formatBytes(galleryFile?.size)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#211A17] truncate">
                        {galleryFile?.name}
                      </p>
                      <p className="text-xs text-[#38271F]/70">
                        Orientação detectada: <strong className="text-[#211A17] capitalize">{galleryForm.aspect}</strong>. O Sharp converterá este arquivo para WebP com qualidade 82% no envio.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => galleryFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#CFB583]/40 text-[#211A17] hover:bg-[#EFE5D5]/50 flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#CFB583]" />
                          Substituir Imagem
                        </button>
                        <button
                          type="button"
                          onClick={handleClearGalleryFile}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Título da Foto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Croissant de Pistache Artesanal"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Categoria *
                  </label>
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
                    <option value="Experiências">Experiências</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Formato Visual (Bento Grid)
                  </label>
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={galleryForm.order}
                    onChange={(e) => setGalleryForm({ ...galleryForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Legenda ou História (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Preparo matinal dos grãos selecionados com torra média e notas de caramelo."
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Status / Progress Banner */}
              {galleryUploadStatus !== "idle" && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
                    galleryUploadStatus === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : galleryUploadStatus === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-[#F8F4EC] text-[#211A17] border border-[#CFB583]/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {galleryUploadStatus === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    ) : galleryUploadStatus === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-[#CFB583] animate-spin shrink-0" />
                    )}
                    <span className="font-medium">{galleryStatusMessage}</span>
                  </div>

                  {(galleryUploadStatus === "uploading" || galleryUploadStatus === "optimizing") && (
                    <span className="text-[11px] font-mono text-[#CFB583] font-semibold">
                      Sharp WebP Engine
                    </span>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={galleryUploadStatus === "uploading" || galleryUploadStatus === "optimizing"}
                  className="py-3 px-6 rounded-xl bg-[#211A17] hover:bg-[#38271F] disabled:opacity-50 text-[#CFB583] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {galleryUploadStatus === "uploading" || galleryUploadStatus === "optimizing" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#CFB583]" />
                      <span>Processando &amp; Otimizando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#CFB583]" />
                      <span>Otimizar &amp; Publicar na Galeria</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                "Todas",
                "Gastronomia",
                "Cafés",
                "Drinks",
                "Sobremesas",
                "Ambiente",
                "Experiências",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    galleryFilterCategory === cat
                      ? "bg-[#211A17] text-[#CFB583] shadow-sm"
                      : "bg-white text-[#38271F]/80 border border-[#CFB583]/20 hover:bg-[#F8F4EC]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#38271F]/50" />
              <input
                type="text"
                placeholder="Buscar por foto ou categoria..."
                value={gallerySearchQuery}
                onChange={(e) => setGallerySearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#CFB583]/30 bg-white focus:border-[#CFB583] focus:outline-none"
              />
            </div>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {gallery
              .filter((item) => {
                const matchesCat =
                  galleryFilterCategory === "Todas" || item.category === galleryFilterCategory;
                const matchesSearch =
                  !gallerySearchQuery.trim() ||
                  item.title?.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
                  item.caption?.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
                  item.category?.toLowerCase().includes(gallerySearchQuery.toLowerCase());
                return matchesCat && matchesSearch;
              })
              .map((item) => {
                const savingsPct =
                  item.originalSize && item.finalSize && item.originalSize > item.finalSize
                    ? Math.round(
                        ((item.originalSize - item.finalSize) / item.originalSize) * 100
                      )
                    : null;

                return (
                  <div
                    key={item.id}
                    className="group rounded-3xl overflow-hidden border border-[#CFB583]/30 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Image Area with Quick Overlays */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badges on Image */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#211A17]/80 text-[#CFB583] backdrop-blur-sm border border-[#CFB583]/30">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/60 text-white backdrop-blur-sm">
                          {item.aspect === "portrait"
                            ? "Vertical (3:4)"
                            : item.aspect === "landscape"
                            ? "Horizontal (4:3)"
                            : item.aspect === "square"
                            ? "Quadrado (1:1)"
                            : "Panorâmico (16:9)"}
                        </span>
                      </div>

                      {/* Format tag */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/90 text-white backdrop-blur-sm uppercase">
                          {item.mimeType ? item.mimeType.replace("image/", "") : "WEBP"}
                        </span>
                      </div>

                      {/* Quick Hover Overlay with View Action */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                        <button
                          type="button"
                          onClick={() => setViewingGalleryItem(item)}
                          className="p-2.5 rounded-full bg-white text-[#211A17] hover:bg-[#CFB583] hover:text-[#211A17] shadow-lg transition-transform hover:scale-110"
                          title="Visualizar em alta resolução"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingGalleryItem(item);
                            setReplaceFile(null);
                            setReplacePreview(null);
                          }}
                          className="p-2.5 rounded-full bg-white text-[#211A17] hover:bg-[#CFB583] hover:text-[#211A17] shadow-lg transition-transform hover:scale-110"
                          title="Substituir foto"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content & Technical Info */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif-editorial text-lg font-semibold text-[#211A17] leading-tight line-clamp-1">
                          {item.title}
                        </h4>
                        {item.caption && (
                          <p className="text-xs text-[#38271F]/70 line-clamp-2 mt-1">
                            {item.caption}
                          </p>
                        )}
                      </div>

                      {/* Technical Specs Footer */}
                      <div className="pt-2 border-t border-[#CFB583]/15 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#38271F]/80">
                          <div>
                            <span className="text-[#38271F]/50 block">Dimensões:</span>
                            <span className="font-mono font-medium text-[#211A17]">
                              {item.width && item.height
                                ? `${item.width} × ${item.height} px`
                                : "Original"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#38271F]/50 block">Tamanho:</span>
                            <span className="font-mono font-medium text-[#211A17] flex items-center gap-1">
                              {formatBytes(item.finalSize || item.originalSize)}
                              {savingsPct ? (
                                <span className="text-emerald-700 font-bold">
                                  (-{savingsPct}%)
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#38271F]/60">
                          <span>{formatDate(item.createdAt)}</span>
                          <span
                            className={`font-semibold ${
                              item.active !== false ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {item.active !== false ? "● Ativa no Site" : "○ Oculta"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="pt-3 border-t border-[#CFB583]/15 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingGalleryItem(item)}
                            className="p-1.5 rounded-lg text-[#211A17] hover:bg-[#F8F4EC] transition-colors"
                            title="Visualizar Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingGalleryItem({ ...item })}
                            className="p-1.5 rounded-lg text-[#211A17] hover:bg-[#F8F4EC] transition-colors"
                            title="Editar Informações"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingGalleryItem(item);
                              setReplaceFile(null);
                              setReplacePreview(null);
                            }}
                            className="p-1.5 rounded-lg text-[#211A17] hover:bg-[#F8F4EC] transition-colors"
                            title="Substituir Imagem"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyImageUrl(item)}
                            className="p-1.5 rounded-lg text-[#211A17] hover:bg-[#F8F4EC] transition-colors"
                            title="Copiar Link da Imagem"
                          >
                            {copiedUrlId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir do Banco e do Armazenamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Modal: Visualizar Imagem em Alta Resolução */}
          {viewingGalleryItem && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#CFB583]/40 shadow-2xl flex flex-col">
                <div className="p-4 sm:p-6 border-b border-[#CFB583]/20 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-editorial text-xl font-bold text-[#211A17]">
                      {viewingGalleryItem.title}
                    </h3>
                    <p className="text-xs text-[#38271F]/60">
                      {viewingGalleryItem.category} • Formato: {viewingGalleryItem.aspect}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingGalleryItem(null)}
                    className="p-2 rounded-xl text-[#211A17] hover:bg-[#F8F4EC]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* High Resolution Image Container */}
                  <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[55vh]">
                    <img
                      src={viewingGalleryItem.image}
                      alt={viewingGalleryItem.title}
                      className="max-h-[55vh] w-auto max-w-full object-contain"
                    />
                  </div>

                  {/* Metadata Specs Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8F4EC]/60 border border-[#CFB583]/30 text-xs">
                    <div>
                      <span className="text-[#38271F]/60 block font-semibold">Dimensões Reais:</span>
                      <span className="font-mono text-[#211A17] font-bold">
                        {viewingGalleryItem.width && viewingGalleryItem.height
                          ? `${viewingGalleryItem.width} × ${viewingGalleryItem.height} px`
                          : "Padrão"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#38271F]/60 block font-semibold">Tamanho WebP:</span>
                      <span className="font-mono text-[#211A17] font-bold">
                        {formatBytes(viewingGalleryItem.finalSize || viewingGalleryItem.originalSize)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#38271F]/60 block font-semibold">Tamanho Original:</span>
                      <span className="font-mono text-[#211A17] font-bold">
                        {formatBytes(viewingGalleryItem.originalSize)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#38271F]/60 block font-semibold">MIME Type:</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {viewingGalleryItem.mimeType || "image/webp"}
                      </span>
                    </div>
                  </div>

                  {viewingGalleryItem.caption && (
                    <div className="p-4 rounded-2xl bg-white border border-[#CFB583]/20">
                      <span className="text-xs font-semibold text-[#211A17] block mb-1">
                        Legenda / História do Prato:
                      </span>
                      <p className="text-xs text-[#38271F]/80 leading-relaxed">
                        {viewingGalleryItem.caption}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs font-mono text-[#38271F]/60 truncate max-w-md">
                      {viewingGalleryItem.image}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={viewingGalleryItem.image}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F8F4EC] text-[#211A17] border border-[#CFB583]/30 hover:bg-[#CFB583]/30 flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir em Nova Aba
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyImageUrl(viewingGalleryItem)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#211A17] text-[#CFB583] hover:bg-[#38271F] flex items-center gap-1.5 transition-colors"
                      >
                        {copiedUrlId === viewingGalleryItem.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar URL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Editar Informações */}
          {editingGalleryItem && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full border border-[#CFB583]/40 shadow-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#CFB583]/20 pb-3">
                  <h3 className="font-serif-editorial text-xl font-bold text-[#211A17]">
                    Editar Informações da Foto
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingGalleryItem(null)}
                    className="p-1.5 rounded-lg text-[#211A17] hover:bg-[#F8F4EC]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateGalleryItem} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#211A17] mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingGalleryItem.title}
                      onChange={(e) =>
                        setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#211A17] mb-1">
                      Categoria *
                    </label>
                    <select
                      value={editingGalleryItem.category}
                      onChange={(e) =>
                        setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                    >
                      <option value="Gastronomia">Gastronomia</option>
                      <option value="Cafés">Cafés Especiais</option>
                      <option value="Drinks">Drinks &amp; Coquetéis</option>
                      <option value="Sobremesas">Sobremesas</option>
                      <option value="Ambiente">Ambiente</option>
                      <option value="Experiências">Experiências</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#211A17] mb-1">
                      Formato Visual (Bento Grid)
                    </label>
                    <select
                      value={editingGalleryItem.aspect}
                      onChange={(e) =>
                        setEditingGalleryItem({ ...editingGalleryItem, aspect: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                    >
                      <option value="portrait">Vertical (3:4)</option>
                      <option value="landscape">Horizontal (4:3)</option>
                      <option value="square">Quadrado (1:1)</option>
                      <option value="wide">Panorâmico (16:9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#211A17] mb-1">
                      Legenda / História
                    </label>
                    <textarea
                      rows={2}
                      value={editingGalleryItem.caption || ""}
                      onChange={(e) =>
                        setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="editActive"
                      checked={editingGalleryItem.active !== false}
                      onChange={(e) =>
                        setEditingGalleryItem({ ...editingGalleryItem, active: e.target.checked })
                      }
                      className="rounded border-[#CFB583]/50 text-[#211A17] focus:ring-[#CFB583]"
                    />
                    <label htmlFor="editActive" className="text-xs font-medium text-[#211A17]">
                      Exibir fotografia na galeria pública do site
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#CFB583]/20">
                    <button
                      type="button"
                      onClick={() => setEditingGalleryItem(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#38271F]/70 hover:bg-[#F8F4EC]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#211A17] text-[#CFB583] hover:bg-[#38271F] text-xs font-semibold shadow-sm"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Substituir Imagem Existente */}
          {replacingGalleryItem && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full border border-[#CFB583]/40 shadow-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#CFB583]/20 pb-3">
                  <div>
                    <h3 className="font-serif-editorial text-xl font-bold text-[#211A17]">
                      Substituir Imagem
                    </h3>
                    <p className="text-xs text-[#38271F]/60">
                      Item: <strong>{replacingGalleryItem.title}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingGalleryItem(null);
                      setReplaceFile(null);
                      setReplacePreview(null);
                    }}
                    className="p-1.5 rounded-lg text-[#211A17] hover:bg-[#F8F4EC]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleConfirmReplaceImage} className="space-y-4">
                  <input
                    type="file"
                    ref={replaceFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSelectReplaceFile(e.target.files[0]);
                      }
                    }}
                  />

                  {!replaceFile && !replacePreview ? (
                    <div
                      onClick={() => replaceFileInputRef.current?.click()}
                      className="cursor-pointer rounded-2xl border-2 border-dashed border-[#CFB583]/40 bg-[#F8F4EC]/50 hover:bg-[#F8F4EC] p-6 text-center transition-all"
                    >
                      <Upload className="w-8 h-8 text-[#CFB583] mx-auto mb-2" />
                      <p className="text-xs font-semibold text-[#211A17]">
                        Clique para escolher a nova foto substituta
                      </p>
                      <p className="text-[10px] text-[#38271F]/60 mt-0.5">
                        JPG, PNG, WEBP ou HEIC (Até 15 MB)
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#F8F4EC]/60 border border-[#CFB583]/30 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-[#CFB583]/40">
                        <img
                          src={replacePreview || ""}
                          alt="Nova foto"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Nova Foto Selecionada
                        </span>
                        <p className="text-xs font-semibold text-[#211A17] truncate mt-1">
                          {replaceFile?.name}
                        </p>
                        <p className="text-[10px] text-[#38271F]/60">
                          {formatBytes(replaceFile?.size)} • Será convertida para WebP
                        </p>
                        <button
                          type="button"
                          onClick={() => replaceFileInputRef.current?.click()}
                          className="mt-2 text-[11px] font-semibold text-[#211A17] hover:underline"
                        >
                          Escolher outro arquivo
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      Ao confirmar, a nova imagem será otimizada com Sharp em WebP e o arquivo antigo será removido do armazenamento para economizar espaço.
                    </span>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#CFB583]/20">
                    <button
                      type="button"
                      disabled={isReplacing}
                      onClick={() => {
                        setReplacingGalleryItem(null);
                        setReplaceFile(null);
                        setReplacePreview(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#38271F]/70 hover:bg-[#F8F4EC]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!replaceFile || isReplacing}
                      className="px-5 py-2 rounded-xl bg-[#211A17] text-[#CFB583] hover:bg-[#38271F] disabled:opacity-50 text-xs font-semibold shadow-sm flex items-center gap-1.5"
                    >
                      {isReplacing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Substituindo...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Confirmar Substituição
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
