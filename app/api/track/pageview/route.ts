import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  isBot, 
  detectDeviceType, 
  detectBrowser, 
  detectOS, 
  classifyTrafficChannel 
} from "@/lib/analytics-tracker";

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (isBot(userAgent)) {
      return NextResponse.json({ ignored: true, reason: "bot" });
    }

    const body = await req.json().catch(() => ({}));
    const {
      sessionId,
      page = "/",
      referrer = null,
      utmSource = null,
      utmMedium = null,
      utmCampaign = null,
      utmContent = null,
      utmTerm = null,
      gclid = null,
      fbclid = null,
      screenResolution = null,
    } = body;

    if (!sessionId || typeof sessionId !== "string" || sessionId.length < 5) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    const channel = classifyTrafficChannel({
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      gclid,
      fbclid,
    });

    const now = new Date();

    // Check if session already exists
    const existingSession = await prisma.analyticsSession.findUnique({
      where: { sessionId },
    });

    if (existingSession) {
      // Update session: increment pageviews, calculate duration
      const durationSeconds = Math.max(
        0,
        Math.round((now.getTime() - new Date(existingSession.firstSeen).getTime()) / 1000)
      );

      await prisma.analyticsSession.update({
        where: { sessionId },
        data: {
          lastSeen: now,
          exitPage: page,
          pageViewsCount: { increment: 1 },
          durationSeconds,
          isBounce: false,
        },
      });
    } else {
      // Create new session
      await prisma.analyticsSession.create({
        data: {
          sessionId,
          firstSeen: now,
          lastSeen: now,
          deviceType,
          browser,
          os,
          country: "BR",
          entryPage: page,
          exitPage: page,
          channel,
          referrer,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          pageViewsCount: 1,
          durationSeconds: 0,
          isBounce: true,
        },
      });

      // Se for uma campanha cadastrada, incrementa o contador da campanha
      if (utmCampaign) {
        await prisma.marketingCampaign.updateMany({
          where: { utmCampaign },
          data: { clicksCount: { increment: 1 } },
        });
      }
    }

    // Register PageView Event
    await prisma.analyticsEvent.create({
      data: {
        sessionId,
        type: "pageview",
        page,
        metadata: JSON.stringify({
          screenResolution,
          timestamp: now.toISOString(),
        }),
      },
    });

    return NextResponse.json({ ok: true, sessionId, channel });
  } catch (error) {
    console.error("Error in /api/track/pageview:", error);
    return NextResponse.json({ error: "Failed to track pageview" }, { status: 500 });
  }
}

