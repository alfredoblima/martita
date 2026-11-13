import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureAnalyticsAndSeoInitialized } from "@/lib/analytics-init";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureAnalyticsAndSeoInitialized();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "7d";
    const customStart = searchParams.get("startDate");
    const customEnd = searchParams.get("endDate");

    const now = new Date();
    let startDate = new Date();
    let prevStartDate = new Date();
    let prevEndDate = new Date();

    if (period === "today") {
      startDate.setHours(0, 0, 0, 0);
      prevStartDate.setDate(prevStartDate.getDate() - 1);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate.setDate(prevEndDate.getDate() - 1);
      prevEndDate.setHours(23, 59, 59, 999);
    } else if (period === "yesterday") {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(startDate);
      endOfYesterday.setHours(23, 59, 59, 999);
      prevStartDate.setDate(prevStartDate.getDate() - 2);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate.setDate(prevEndDate.getDate() - 2);
      prevEndDate.setHours(23, 59, 59, 999);
    } else if (period === "7d") {
      startDate.setDate(startDate.getDate() - 7);
      prevStartDate.setDate(prevStartDate.getDate() - 14);
      prevEndDate.setDate(prevEndDate.getDate() - 7);
    } else if (period === "30d") {
      startDate.setDate(startDate.getDate() - 30);
      prevStartDate.setDate(prevStartDate.getDate() - 60);
      prevEndDate.setDate(prevEndDate.getDate() - 30);
    } else if (period === "this_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    } else if (period === "last_month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      now.setDate(0); // last day of prev month
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
    } else if (customStart && customEnd) {
      startDate = new Date(customStart);
      const span = now.getTime() - startDate.getTime();
      prevEndDate = new Date(startDate.getTime() - 1);
      prevStartDate = new Date(startDate.getTime() - span);
    } else {
      startDate.setDate(startDate.getDate() - 7);
      prevStartDate.setDate(prevStartDate.getDate() - 14);
      prevEndDate.setDate(prevEndDate.getDate() - 7);
    }

    // 1. Current Period Sessions
    const currentSessions = await prisma.analyticsSession.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: "desc" },
    });

    // 2. Previous Period Sessions for comparison
    const previousSessionsCount = await prisma.analyticsSession.count({
      where: { createdAt: { gte: prevStartDate, lte: prevEndDate } },
    });

    const previousPageviews = await prisma.analyticsEvent.count({
      where: { type: "pageview", createdAt: { gte: prevStartDate, lte: prevEndDate } },
    });

    const totalSessions = currentSessions.length;
    const totalPageviews = currentSessions.reduce((sum, s) => sum + s.pageViewsCount, 0);
    const uniqueVisitors = totalSessions;
    const bounces = currentSessions.filter((s) => s.isBounce).length;
    const bounceRate = totalSessions > 0 ? Math.round((bounces / totalSessions) * 100) : 0;
    const totalDuration = currentSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    // Percent changes
    const diffSessionsPercent = previousSessionsCount > 0
      ? Math.round(((totalSessions - previousSessionsCount) / previousSessionsCount) * 100)
      : totalSessions > 0 ? 100 : 0;

    const diffPageviewsPercent = previousPageviews > 0
      ? Math.round(((totalPageviews - previousPageviews) / previousPageviews) * 100)
      : totalPageviews > 0 ? 100 : 0;

    // 3. Conversions in current period
    const conversions = await prisma.conversionEvent.findMany({
      where: { createdAt: { gte: startDate } },
    });

    const totalConversions = conversions.length;
    const whatsappClicks = conversions.filter((c) => c.type === "whatsapp_click").length;
    const phoneClicks = conversions.filter((c) => c.type === "phone_click").length;
    const menuViews = conversions.filter((c) => c.type === "menu_view").length;
    const conversionRate = totalSessions > 0 ? Number(((totalConversions / totalSessions) * 100).toFixed(1)) : 0;

    // 4. Channel breakdown
    const channelCounts: Record<string, number> = {};
    for (const s of currentSessions) {
      channelCounts[s.channel] = (channelCounts[s.channel] || 0) + 1;
    }

    const channelLabels: Record<string, string> = {
      google_organic: "Google Orgânico",
      instagram: "Instagram",
      direct: "Acesso Direto",
      whatsapp: "WhatsApp",
      facebook: "Facebook / Meta",
      google_ads: "Google Ads",
      campaign: "Campanhas UTM",
      external: "Sites Parceiros",
      other_search: "Outros Buscadores",
    };

    const channelDistribution = Object.entries(channelCounts)
      .map(([key, count]) => ({
        channel: key,
        label: channelLabels[key] || key,
        count,
        percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 5. Device breakdown
    const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    for (const s of currentSessions) {
      if (deviceCounts[s.deviceType] !== undefined) {
        deviceCounts[s.deviceType]++;
      } else {
        deviceCounts.desktop++;
      }
    }

    const deviceBreakdown = [
      {
        device: "mobile",
        label: "Smartphones",
        count: deviceCounts.mobile,
        percentage: totalSessions > 0 ? Math.round((deviceCounts.mobile / totalSessions) * 100) : 0,
      },
      {
        device: "desktop",
        label: "Computadores",
        count: deviceCounts.desktop,
        percentage: totalSessions > 0 ? Math.round((deviceCounts.desktop / totalSessions) * 100) : 0,
      },
      {
        device: "tablet",
        label: "Tablets",
        count: deviceCounts.tablet,
        percentage: totalSessions > 0 ? Math.round((deviceCounts.tablet / totalSessions) * 100) : 0,
      },
    ];

    // 6. Timeline of visits (grouped by day)
    const timelineMap: Record<string, { date: string; sessions: number; pageviews: number }> = {};
    const daysCount = Math.max(1, Math.min(30, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))));

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const displayLabel = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      timelineMap[key] = { date: displayLabel, sessions: 0, pageviews: 0 };
    }

    for (const s of currentSessions) {
      const key = s.createdAt.toISOString().split("T")[0];
      if (timelineMap[key]) {
        timelineMap[key].sessions++;
        timelineMap[key].pageviews += s.pageViewsCount;
      }
    }

    const trafficTimeline = Object.values(timelineMap);

    // 7. Top pages
    const pageCounts: Record<string, { page: string; views: number; sessions: Set<string> }> = {};
    const events = await prisma.analyticsEvent.findMany({
      where: { type: "pageview", createdAt: { gte: startDate } },
      select: { page: true, sessionId: true },
    });

    for (const ev of events) {
      if (!pageCounts[ev.page]) {
        pageCounts[ev.page] = { page: ev.page, views: 0, sessions: new Set() };
      }
      pageCounts[ev.page].views++;
      pageCounts[ev.page].sessions.add(ev.sessionId);
    }

    const topPages = Object.values(pageCounts)
      .map((p) => ({
        page: p.page,
        views: p.views,
        uniqueSessions: p.sessions.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // 8. Hourly distribution (0-23h)
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, "0")}h`,
      sessions: 0,
    }));

    for (const s of currentSessions) {
      const hour = new Date(s.createdAt).getHours();
      if (hourlyDistribution[hour]) {
        hourlyDistribution[hour].sessions++;
      }
    }

    return NextResponse.json({
      period,
      summary: {
        totalSessions,
        totalPageviews,
        uniqueVisitors,
        bounceRate,
        avgDuration,
        totalConversions,
        whatsappClicks,
        phoneClicks,
        menuViews,
        conversionRate,
        diffSessionsPercent,
        diffPageviewsPercent,
      },
      channelDistribution,
      deviceBreakdown,
      trafficTimeline,
      topPages,
      hourlyDistribution,
      recentSessions: currentSessions.slice(0, 15).map((s) => ({
        id: s.id,
        sessionId: s.sessionId.slice(0, 12) + "...",
        channel: s.channel,
        deviceType: s.deviceType,
        entryPage: s.entryPage,
        pageViewsCount: s.pageViewsCount,
        durationSeconds: s.durationSeconds,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error in /api/admin/analytics:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}

