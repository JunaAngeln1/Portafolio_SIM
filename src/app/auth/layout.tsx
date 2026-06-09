import { PawPrint } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full animate-float" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-white/5 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full animate-float" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-8">
            <PawPrint className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">SIM</h1>
          <p className="text-xl text-white/80 mb-8 text-center">Sistema Integral de Mascotas</p>
          
          <p className="text-white/70 text-center mb-12 max-w-md leading-relaxed">
            Plataforma profesional para la gestión y digitalización de portafolios veterinarios.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary">SIM</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
