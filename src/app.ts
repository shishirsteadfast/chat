// src/app.ts
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import { env } from './config/env';
import routes from './routes';
import { initModels } from './models';

const app = express();

// --------- Initialize DB models (Sequelize) ----------
initModels().catch((err) => {
  console.error('DB init error:', err);
});

// --------- View engine & layouts ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);

// Default layout for non-auth pages (admin UI)
app.set('layout', 'layouts/master');

// Allow using <%- script %> and <%- style %> in views if needed
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// --------- Static assets ----------
app.use(
  '/assets',
  express.static(path.join(__dirname, 'public', 'assets'))
);

// --------- Core middlewares ----------
app.use(cors());
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.json()); // JSON bodies

app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// --------- Routes ----------
app.use('/', routes);

// Root → redirect to admin login
app.get('/', (_req, res) => {
  res.redirect('/admin/login');
});

// Health check (optional, useful)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
