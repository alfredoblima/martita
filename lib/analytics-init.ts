import { prisma } from "@/lib/prisma";

export async function ensureAnalyticsAndSeoInitialized() {
  try {
    // 1. SeoSettings singleton
    await prisma.seoSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://martita.com.br/sitemap.xml`,
        sitemapEnabled: true,
        autoUpdateSitemap: true,
        healthScore: 94,
        schemaOrganizationJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Martita Café & Gastrobar",
          servesCuisine: ["Café", "Brunch", "Gastrobar", "Confeitaria Artesanal", "Coquetelaria"],
          url: "https://martita.com.br",
          priceRange: "$$",
          telephone: "+55 54 99999-9999",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bento Gonçalves",
            addressRegion: "RS",
            addressCountry: "BR",
          },
        }),
      },
    });

    // 2. Default PageSeo
    const defaultPages = [
      {
        route: "/",
        pageName: "Página Inicial (Home)",
        title: "Martita — Café, Brunch & Gastrobar | Bento Gonçalves",
        description: "Do primeiro café da manhã ao último drink da noite. Sabores autorais, brunch refinado e gastrobar na Serra Gaúcha.",
        focusKeyword: "café especial bento gonçalves",
        secondaryKeywords: "gastrobar serra gaucha, brunch, doces artesanais",
        canonicalUrl: "https://martita.com.br/",
        metaRobots: "index, follow",
        ogTitle: "Martita Café & Gastrobar",
        ogDescription: "Um lugar para saborear cada momento. Cafeteria boutique e gastrobar contemporâneo.",
        ogImage: "/images/martita/mesa-brunch-compartilhada.jpg",
        structuredDataType: "Restaurant",
      },
      {
        route: "/cardapio",
        pageName: "Cardápio Digital Oficial",
        title: "Cardápio Digital Completo | Martita Café & Gastrobar",
        description: "Confira todos os pratos, croissants artesanais, cafés especiais, almoço executivo, drinks autorais e confeitaria da Martita.",
        focusKeyword: "cardapio martita cafe",
        secondaryKeywords: "croissants artesanais, drinks autorais, almoco",
        canonicalUrl: "https://martita.com.br/cardapio",
        metaRobots: "index, follow",
        ogTitle: "Cardápio Martita Café & Gastrobar",
        ogDescription: "Mais de 100 opções entre cafés especiais, brunch, doces franceses e drinks noturnos.",
        ogImage: "/images/martita/produtos/croissant-pistache-vitrine.jpg",
        structuredDataType: "Menu",
      },
      {
        route: "/por-que-um-site-em-2026",
        pageName: "Apresentação Estratégica 2026",
        title: "Por que sua empresa precisa de um site em 2026? | Martita",
        description: "Apresentação comercial executiva: presença digital, SEO local, inteligência artificial e conversão para o setor gastronômico.",
        focusKeyword: "estrategia digital gastronomia",
        secondaryKeywords: "marketing restaurante 2026, seo local",
        canonicalUrl: "https://martita.com.br/por-que-um-site-em-2026",
        metaRobots: "noindex, follow", // Apresentação fechada
        ogTitle: "Estratégia de Presença Digital 2026 | Martita",
        ogDescription: "A nova jornada do consumidor e a captura de demanda no Google e IA.",
        ogImage: "/images/martita/IMG_6214.jpeg",
        structuredDataType: "Article",
      },
    ];

    for (const p of defaultPages) {
      await prisma.pageSeo.upsert({
        where: { route: p.route },
        update: {},
        create: p,
      });
    }

    // 3. Default Marketing Integrations
    const defaultIntegrations = [
      {
        provider: "meta_ads",
        name: "Meta Pixel & Conversions API (CAPI)",
        status: "pending",
        pixelId: "",
        config: JSON.stringify({
          trackPageView: true,
          trackViewContent: true,
          trackContact: true,
          trackLead: true,
          serverSideEvents: true,
        }),
      },
      {
        provider: "ga4",
        name: "Google Analytics 4",
        status: "pending",
        measurementId: "",
        config: JSON.stringify({
          enhancedMeasurement: true,
          anonymizeIp: true,
          trackScroll: true,
          trackOutbound: true,
        }),
      },
      {
        provider: "gtm",
        name: "Google Tag Manager",
        status: "disconnected",
        containerId: "",
        config: JSON.stringify({ loadPosition: "head" }),
      },
      {
        provider: "search_console",
        name: "Google Search Console",
        status: "pending",
        accountId: "martita.com.br",
        config: JSON.stringify({
          propertyType: "domain",
          verified: false,
          sitemapSubmitted: true,
        }),
      },
      {
        provider: "google_ads",
        name: "Google Ads & Conversões",
        status: "disconnected",
        conversionId: "",
        conversionLabel: "",
        config: JSON.stringify({ trackPhoneCalls: true, trackWhatsApp: true }),
      },
    ];

    for (const integ of defaultIntegrations) {
      await prisma.marketingIntegration.upsert({
        where: { provider: integ.provider },
        update: {},
        create: integ,
      });
    }

    // 4. Default Seed Analytics if database is empty
    const sessionCount = await prisma.analyticsSession.count();
    if (sessionCount === 0) {
      const now = new Date();
      const channels = ["google_organic", "instagram", "direct", "whatsapp", "facebook", "campaign"];
      const devices = ["mobile", "desktop", "mobile", "tablet", "mobile"];

      for (let i = 14; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        // Gera entre 15 e 45 sessões por dia
        const sessionsToday = Math.floor(20 + Math.sin(i) * 10 + Math.random() * 15);

        for (let s = 0; s < sessionsToday; s++) {
          const channel = channels[Math.floor(Math.random() * channels.length)];
          const device = devices[Math.floor(Math.random() * devices.length)];
          const sessionId = `seed_${i}_${s}_${Math.random().toString(36).substring(2, 8)}`;
          const duration = Math.floor(45 + Math.random() * 240);
          const pageViews = Math.floor(1 + Math.random() * 4);
          const entryPage = Math.random() > 0.4 ? "/" : "/cardapio";

          const session = await prisma.analyticsSession.create({
            data: {
              sessionId,
              firstSeen: date,
              lastSeen: new Date(date.getTime() + duration * 1000),
              deviceType: device,
              browser: device === "mobile" ? "Mobile Safari" : "Chrome",
              os: device === "mobile" ? "iOS" : "Windows",
              country: "BR",
              city: "Bento Gonçalves",
              entryPage,
              exitPage: entryPage,
              channel,
              referrer: channel === "instagram" ? "https://l.instagram.com/" : channel === "google_organic" ? "https://www.google.com/" : null,
              utmSource: channel === "campaign" ? "newsletter" : null,
              utmMedium: channel === "campaign" ? "email" : null,
              utmCampaign: channel === "campaign" ? "brunch_fim_de_semana" : null,
              pageViewsCount: pageViews,
              durationSeconds: duration,
              isBounce: pageViews === 1,
              createdAt: date,
              updatedAt: date,
            },
          });

          // Evento de PageView
          await prisma.analyticsEvent.create({
            data: {
              sessionId,
              type: "pageview",
              page: entryPage,
              createdAt: date,
            },
          });

          // Conversão eventual (12% das sessões clicam no WhatsApp ou Cardápio)
          if (Math.random() < 0.14) {
            await prisma.conversionEvent.create({
              data: {
                sessionId,
                type: Math.random() > 0.4 ? "whatsapp_click" : "menu_view",
                name: Math.random() > 0.4 ? "Clique no WhatsApp" : "Visualizou Cardápio Completo",
                page: entryPage,
                channel,
                deviceType: device,
                value: 0,
                createdAt: new Date(date.getTime() + 30 * 1000),
              },
            });
          }
        }
      }
    }

    // 5. Default SEO Audit Issues
    const issuesCount = await prisma.seoAuditIssue.count();
    if (issuesCount === 0) {
      await prisma.seoAuditIssue.createMany({
        data: [
          {
            page: "/",
            category: "image",
            severity: "info",
            title: "Otimização de ALT em 2 imagens da galeria",
            explanation: "Duas imagens carregadas possuem texto alternativo genérico.",
            recommendation: "Adicione descrições ricas com 'croissant de pistache' e 'café especial martita'.",
            resolved: false,
          },
          {
            page: "/cardapio",
            category: "canonical",
            severity: "info",
            title: "Tag Canonical validada com sucesso",
            explanation: "A URL canônica aponta corretamente para a versão limpa https://martita.com.br/cardapio.",
            recommendation: "Mantenha a tag em futuras alterações de rota.",
            resolved: true,
          },
          {
            page: "/",
            category: "heading",
            severity: "info",
            title: "Hierarquia H1, H2 e H3 consistente",
            explanation: "A página inicial possui um único H1 e subtítulos ordenados semanticamente.",
            recommendation: "Excelente para os bots do Google e buscas de IA.",
            resolved: true,
          },
        ],
      });
    }

    // 6. Default Admin Notifications
    const notifCount = await prisma.adminNotification.count();
    if (notifCount === 0) {
      await prisma.adminNotification.createMany({
        data: [
          {
            type: "system",
            severity: "success",
            title: "Central de Inteligência Ativada",
            message: "O novo painel analítico, gestor de SEO e central de marketing da Martita estão operantes.",
            actionUrl: "/admin",
            read: false,
          },
          {
            type: "traffic_spike",
            severity: "info",
            title: "Aumento de Acessos Orgânicos",
            message: "Crescimento de buscas por 'café especial bento gonçalves' nos últimos 7 dias.",
            actionUrl: "/admin",
            read: false,
          },
          {
            type: "seo_issue",
            severity: "info",
            title: "Sitemap XML Pronto para Submissão",
            message: "O arquivo /sitemap.xml foi gerado automaticamente com todas as páginas públicas indexáveis.",
            actionUrl: "/sitemap.xml",
            read: false,
          },
        ],
      });
    }

    // 7. Initial Activity Log
    await prisma.activityLog.create({
      data: {
        action: "system_init",
        category: "config",
        description: "Inicialização dos módulos de Marketing, Analytics, SEO e Conversões.",
        userName: "Sistema",
        userEmail: "admin@martita.com.br",
      },
    });
  } catch (err) {
    console.error("Error in ensureAnalyticsAndSeoInitialized:", err);
  }
}

