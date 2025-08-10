// hit this api route with vercel cron, github actions or any other cron service

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sendMovieReleaseReminderEmail } from "@/lib/mailer";

export async function GET() {
  //token
  const token = process.env.CRON_TOKEN;

  if (token !== process.env.CRON_TOKEN) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find movies releasing today
    const moviesReleasingToday = await db.movie.findMany({
      where: {
        releaseDate: {
          gte: today,
          lt: tomorrow,
        },
        remindUserOnLaunch: true,
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    let sent = 0;
    for (const mv of moviesReleasingToday) {
      if (!mv.user?.email) continue;
      const res = await sendMovieReleaseReminderEmail(
        mv.user.email,
        mv.title,
        mv.releaseDate?.toISOString()
      );

      // Update reminder to avoid sending multiple emails
      await db.movieReleaseReminder.update({
        where: {
          movieId_userId: {
            movieId: mv.id,
            userId: mv.userId,
          },
        },
        data: { alreadySent: true },
      });
      if (res.success) sent += 1;
    }

    return NextResponse.json({ success: true, count: sent });
  } catch (error) {
    console.error("check-releases cron error", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
