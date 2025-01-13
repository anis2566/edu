import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from "hono/cors";
import { createRouteHandler } from 'uploadthing/server';

import { authRouter } from '@/features/auth/server/route';
import { categoryRouter } from '@/server/category/route';
import { attachmentRouter } from '@/server/attachment/route';
import { videoCipherRouter } from '@/server/video-cipher/route';
import { questionRouter } from '@/server/question/route';
import { answerRouter } from '@/server/answer/route';
import { assignmentRouter } from '@/server/assignment/route';
import { paymentRouter } from '@/features/server/routes/payment/route';
import { webhookRouter } from '@/features/server/webhook/route';
import { uploadRouter } from '@/lib/uploadthing';
import { courseRouter } from '@/server/course/route';
import { chapterRouter } from '@/server/chapter/route';
import { submissionRouter } from '@/server/submission/route';

const handlers = createRouteHandler({
    router: uploadRouter,
});

const app = new Hono()
    .basePath('/api')
    .use(cors())
    .all("/uploadthing", (c) => handlers(c.req.raw))
    .route('/auth', authRouter)
    .route('/category', categoryRouter)
    .route('/course', courseRouter)
    .route('/chapter', chapterRouter)
    .route('/attachment', attachmentRouter)
    .route('/videoCipher', videoCipherRouter)
    .route('/question', questionRouter)
    .route('/answer', answerRouter)
    .route('/payment', paymentRouter)
    .route('/webhooks', webhookRouter)
    .route('/assignment', assignmentRouter)
    .route('/submission', submissionRouter)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export type AppType = typeof app;