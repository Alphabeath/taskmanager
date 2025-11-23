"user client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Zap, Users, BarChart3, Clock, Star } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-neutral-900 dark:text-neutral-50" />
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Task Manager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login"><Button variant="ghost" className="cursor-pointer">Iniciar sesión</Button></Link>
            <Link href="/signup"><Button className="cursor-pointer">Comenzar gratis</Button></Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            Gestión de tareas simplificada
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-6xl lg:text-7xl">
            Organiza tu trabajo,
            <br />
            <span className="bg-linear-to-r from-neutral-600 to-neutral-900 bg-clip-text text-transparent dark:from-neutral-200 dark:to-neutral-400">
              alcanza tus metas
            </span>
          </h1>
          <p className="mb-8 text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
            La herramienta todo-en-uno para gestionar tareas, proyectos y equipos.
            Aumenta tu productividad y colabora sin esfuerzo.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="text-lg cursor-pointer">
              <Zap className="mr-2 h-5 w-5" />
              Comenzar ahora
            </Button>
            <Button size="lg" variant="secondary" className="text-lg cursor-pointer">
              Ver demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
            ✨ Sin tarjeta de crédito requerida • Prueba gratuita de 14 días
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-50 md:text-4xl">
            Todo lo que necesitas para triunfar
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Potentes funciones diseñadas para equipos modernos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CheckCircle2 className="mb-4 h-12 w-12 text-neutral-900 dark:text-neutral-50" />
              <CardTitle>Gestión de Tareas</CardTitle>
              <CardDescription>
                Crea, asigna y rastrea tareas con facilidad. Mantén todo organizado en un solo lugar.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="mb-4 h-12 w-12 text-neutral-900 dark:text-neutral-50" />
              <CardTitle>Colaboración en Equipo</CardTitle>
              <CardDescription>
                Trabaja junto a tu equipo en tiempo real. Comparte actualizaciones y mantén a todos alineados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-4 h-12 w-12 text-neutral-900 dark:text-neutral-50" />
              <CardTitle>Análisis y Reportes</CardTitle>
              <CardDescription>
                Obtén información valiosa con reportes detallados y visualizaciones de datos.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="mb-4 h-12 w-12 text-neutral-900 dark:text-neutral-50" />
              <CardTitle>Seguimiento de Tiempo</CardTitle>
              <CardDescription>
                Registra el tiempo dedicado a cada tarea y proyecto para una mejor planificación.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="mb-4 h-12 w-12 text-neutral-900 dark:text-neutral-50" />
              <CardTitle>Automatización</CardTitle>
              <CardDescription>
                Automatiza tareas repetitivas y ahorra tiempo valioso con flujos de trabajo inteligentes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Star className="mb-4 h-12 w-12 text-neutral-900 dark:text-neutral-50" />
              <CardTitle>Priorización</CardTitle>
              <CardDescription>
                Establece prioridades y fechas límite para enfocarte en lo que realmente importa.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-neutral-900 dark:text-neutral-50">
              50K+
            </div>
            <div className="text-lg text-neutral-600 dark:text-neutral-400">
              Usuarios Activos
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-neutral-900 dark:text-neutral-50">
              1M+
            </div>
            <div className="text-lg text-neutral-600 dark:text-neutral-400">
              Tareas Completadas
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-neutral-900 dark:text-neutral-50">
              99.9%
            </div>
            <div className="text-lg text-neutral-600 dark:text-neutral-400">
              Tiempo de Actividad
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-neutral-900 text-neutral-50 dark:bg-neutral-800">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              ¿Listo para aumentar tu productividad?
            </h2>
            <p className="max-w-2xl text-lg text-neutral-300">
              Únete a miles de equipos que ya están logrando más con Task Manager.
              Comienza tu prueba gratuita hoy mismo.
            </p>
            <Link href="/signup"><Button size="lg" variant="secondary" className="text-lg dark:bg-neutral-700 cursor-pointer">
              Comenzar gratis
            </Button></Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:flex-row">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">
              Task Manager
            </span>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            © 2025 Task Manager. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
