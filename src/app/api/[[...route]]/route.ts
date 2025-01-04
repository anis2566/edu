import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from "hono/cors";

import { authRouter } from '@/features/auth/server/route';
import { categoryRouter } from '@/features/dashboard/category/server/route';
import { courseRouter } from '@/features/dashboard/course/server/route';
import { chapterRouter } from '@/features/dashboard/course/chapter/server/route';
import { paymentRouter } from '@/features/server/routes/payment/route';

const app = new Hono()
    .basePath('/api')
    .use(cors())
    .route('/auth', authRouter)
    .route('/category', categoryRouter)
    .route('/course', courseRouter)
    .route('/chapter', chapterRouter)
    .route('/payment', paymentRouter)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export type AppType = typeof app;