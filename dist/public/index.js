// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { z } from "zod";
var toothConfigurationSchema = z.object({
  toothNumber: z.string(),
  toothName: z.string(),
  workType: z.enum(["provisorio", "definitivo"]).optional(),
  material: z.enum(["zirconia", "pmma", "dissilicato"]).optional(),
  color: z.enum(["A1", "A2", "A3", "BL1", "BL2", "BL3", "BL4"]).optional(),
  workCategory: z.enum(["faceta", "onlay", "sob_implante", "sob_dente", "placa_mio"]).optional(),
  implantType: z.enum([
    "pilar_gt",
    "munhao_universal_33x6",
    "munhao_universal_33x4",
    "he_41",
    "mini_pilar_sirona"
  ]).optional(),
  fixationType: z.enum(["unitaria", "protocolo"]).optional(),
  isFixed: z.boolean().default(false),
  connectedTeeth: z.string().optional(),
  mirrorTooth: z.boolean().default(false),
  standardLibrary: z.boolean().default(false),
  toothShape: z.enum(["redondo", "quadrado", "pontudo"]).optional(),
  articulator: z.boolean().default(false),
  articulatorMM: z.number().optional()
});
var dentalOrderSchema = z.object({
  patientName: z.string().min(1, "Nome do paciente \xE9 obrigat\xF3rio"),
  patientId: z.string().optional(),
  selectedTeeth: z.array(z.object({
    number: z.string(),
    name: z.string(),
    id: z.string()
  })),
  toothConfigurations: z.record(z.string(), toothConfigurationSchema),
  observations: z.string().optional(),
  timestamp: z.string()
});
var insertDentalOrderSchema = dentalOrderSchema.omit({
  timestamp: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/dental-orders", async (req, res) => {
    try {
      const validatedData = insertDentalOrderSchema.parse(req.body);
      const dentalOrder = {
        ...validatedData,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json({ success: true, data: dentalOrder });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Invalid data"
      });
    }
  });
  app2.get("/api/dental-orders", async (req, res) => {
    res.json({ success: true, data: [] });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
