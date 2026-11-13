import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let seoSettings = await prisma.seoSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!seoSettings) {
      seoSettings = await prisma.seoSettings.create({
        data: { id: "singleton" },
      });
    }

    const issues = await prisma.seoAuditIssue.findMany({
      orderBy: [{ resolved: "asc" }, { severity: "asc" }, { createdAt: "desc" }],
    });

    const pages = await prisma.pageSeo.findMany({
      orderBy: { route: "asc" },
    });

    const redirectsCount = await prisma.seoRedirect.count();

    // Calcula a pontuação real com base nas issues pendentes
    const errorCount = issues.filter((i) => !i.resolved && i.severity === "error").length;
    const warningCount = issues.filter((i) => !i.resolved && i.severity === "warning").length;
    const calculatedScore = Math.max(50, Math.min(100, 100 - errorCount * 12 - warningCount * 4));

    return NextResponse.json({
      settings: seoSettings,
      healthScore: calculatedScore,
      issues,
      pages,
      redirectsCount,
      summary: {
        totalIssues: issues.length,
        unresolvedIssues: issues.filter((i) => !i.resolved).length,
        errors: errorCount,
        warnings: warningCount,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/seo:", error);
    return NextResponse.json({ error: "Failed to fetch SEO data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      robotsTxt,
      sitemapEnabled,
      autoUpdateSitemap,
      schemaOrganizationJson,
      schemaLocalBusinessJson,
      action,
    } = body;

    // Se a ação for "run_audit"
    if (action === "run_audit") {
      // Executa auditoria técnica real verificando páginas e configurações
      const auditIssues: {
        page: string;
        category: string;
        severity: string;
        title: string;
        explanation: string;
        recommendation: string;
      }[] = [];

      const pages = await prisma.pageSeo.findMany();
      for (const p of pages) {
        if (!p.title || p.title.length < 20) {
          auditIssues.push({
            page: p.route,
            category: "title",
            severity: "warning",
            title: `Título curto na página ${p.pageName}`,
            explanation: `O SEO Title possui apenas ${p.title?.length || 0} caracteres (recomendado: 45 a 65).`,
            recommendation: "Escreva um título descritivo incluindo a palavra-chave e a localização.",
          });
        }
        if (!p.description || p.description.length < 50) {
          auditIssues.push({
            page: p.route,
            category: "description",
            severity: "error",
            title: `Meta Description incompleta em ${p.pageName}`,
            explanation: "Meta descriptions com menos de 70 caracteres perdem atratividade nos cliques do Google.",
            recommendation: "Expanda a meta descrição para entre 120 e 160 caracteres.",
          });
        }
        if (!p.focusKeyword) {
          auditIssues.push({
            page: p.route,
            category: "title",
            severity: "info",
            title: `Nenhuma palavra-chave foco definida em ${p.pageName}`,
            explanation: "Definir a palavra-chave principal ajuda a monitorar o ranqueamento no Search Console.",
            recommendation: "Informe o termo exato pesquisado pelo seu público (ex: 'café especial bento gonçalves').",
          });
        }
      }

      // Limpa auditorias antigas não resolvidas e reinsere
      await prisma.seoAuditIssue.deleteMany({ where: { resolved: false } });

      for (const issue of auditIssues) {
        await prisma.seoAuditIssue.create({
          data: {
            ...issue,
            resolved: false,
          },
        });
      }

      await prisma.seoSettings.update({
        where: { id: "singleton" },
        data: { lastAuditAt: new Date() },
      });

      await prisma.activityLog.create({
        data: {
          action: "run_seo_audit",
          category: "seo",
          description: `Auditoria técnica de SEO executada. ${auditIssues.length} apontamentos encontrados.`,
          userName: session.name,
          userEmail: session.email,
        },
      });

      return NextResponse.json({
        ok: true,
        message: "Auditoria de SEO concluída com sucesso!",
        issuesFound: auditIssues.length,
      });
    }

    // Atualização padrão de robots e sitemap
    const updated = await prisma.seoSettings.upsert({
      where: { id: "singleton" },
      update: {
        robotsTxt: robotsTxt ?? undefined,
        sitemapEnabled: sitemapEnabled !== undefined ? Boolean(sitemapEnabled) : undefined,
        autoUpdateSitemap: autoUpdateSitemap !== undefined ? Boolean(autoUpdateSitemap) : undefined,
        schemaOrganizationJson: schemaOrganizationJson ? JSON.stringify(schemaOrganizationJson) : undefined,
        schemaLocalBusinessJson: schemaLocalBusinessJson ? JSON.stringify(schemaLocalBusinessJson) : undefined,
      },
      create: {
        id: "singleton",
        robotsTxt: robotsTxt || "User-agent: *\nAllow: /\nDisallow: /admin/\n",
        sitemapEnabled: Boolean(sitemapEnabled ?? true),
        autoUpdateSitemap: Boolean(autoUpdateSitemap ?? true),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "update_seo_settings",
        category: "seo",
        description: "Configurações de robots.txt e Schema atualizadas.",
        userName: session.name,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ ok: true, settings: updated });
  } catch (error) {
    console.error("Error in PUT /api/admin/seo:", error);
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 });
  }
}

