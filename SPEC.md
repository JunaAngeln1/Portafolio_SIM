# SIM Platform — Phase 1 Specification

## 1. Concept & Vision

A premium veterinary portfolio management platform with a clean, medical-corporate aesthetic. The interface feels like a modern SaaS administrative dashboard—professional, trustworthy, and efficient. Every interaction should feel smooth and intentional, conveying reliability for veterinary business management.

**Language: Spanish (100%)**

## 2. Design Language

### Aesthetic Direction
Medical-corporate SaaS dashboard inspired by modern healthcare admin systems. Clean lines, ample whitespace, subtle depth through shadows, and a calming blue palette that conveys trust and professionalism.

### Color Palette
- **Primary Blue**: `#2E4E9E` — Main brand color, buttons, accents
- **Dark Blue**: `#1E3A5F` — Sidebar, headers, emphasis
- **Light Background**: `#F4F6F9` — Page backgrounds
- **White**: `#FFFFFF` — Cards, content areas
- **Soft Gray**: `#E5E7EB` — Borders, dividers, disabled states
- **Success Green**: `#10B981` — Active status, success states
- **Warning Yellow**: `#F59E0B` — Warning badges, pending states
- **Error Red**: `#EF4444` — Error states, delete actions
- **Category Colors**:
  - CONSULTA: `#3B82F6` (Blue)
  - CIRUGIA: `#EC4899` (Pink)
  - LABORATORIO: `#6B7280` (Gray)
  - IMAGENES: `#8B5CF6` (Purple)
  - VACUNAS: `#EAB308` (Yellow)
  - PROCEDIMIENTOS: `#F97316` (Orange)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight
- **Scale**: 12px / 14px / 16px / 18px / 24px / 32px / 48px

### Spatial System
- Base unit: 4px
- Component padding: 12px / 16px / 24px
- Card padding: 24px
- Section gaps: 24px / 32px
- Border radius: 6px (small), 8px (medium), 12px (large), 16px (cards)

### Motion Philosophy
- Transitions: 150ms ease-out for hovers, 200ms for modals
- Subtle scale on button hover (1.02)
- Smooth fade-in for page transitions
- Table row highlight on hover

## 3. Layout & Structure

### Welcome Screen (/)
- **Split layout**: 55% blue gradient left / 45% white right
- Left: Centered content with logo, title, features list, decorative circles
- Right: Welcome message, tagline, prominent "Comenzar" button
- Full viewport height, no scroll

### Main Dashboard (/dashboard)
- **Sidebar**: 260px fixed dark blue sidebar on left
- **Main content**: Flexible width with `#F4F6F9` background
- **Top bar**: Title, notifications, user profile

### Responsive Strategy
- Desktop: Full sidebar + content
- Tablet (< 1024px): Collapsible sidebar overlay
- Mobile (< 768px): Hidden sidebar with hamburger menu

## 4. Features & Interactions

### Welcome Screen
- Click "Comenzar" → Navigate to `/dashboard`
- Decorative circles have subtle floating animation

### Sidebar Navigation
- Items: Panel Principal, Portafolios, Cotizaciones, Veterinarias, Configuración
- Active state: Light blue background with white text
- Hover: Subtle background highlight

### Portfolio Management
- **Create**: Modal form with all service fields
- **Edit**: Same modal, pre-filled
- **Delete**: Confirmation dialog
- **Duplicate**: Creates copy with "(Copia)" suffix
- **Disable/Enable**: Toggle status without deleting

### Filter System
- Dropdowns for: Veterinarias, Ciudades, Categorías, Modo de Servicio, Estado
- Search bar with real-time filtering
- Quick filter pills (Activo, Inactivo)
- "Limpiar" button to reset all filters

### Import System
- Import via JSON file or paste directly
- Validates JSON structure
- Shows preview of data to import
- Reports success with count of imported items
- Option to clear all data before import

### Data Persistence
- All data stored in localStorage
- Key: `simp_data`
- Auto-saves on every change
- Survives page refresh

## 5. Component Inventory

### Buttons
- **Primary**: Blue background, white text, hover darkens
- **Secondary**: White background, blue border, hover fills
- **Danger**: Red variant for destructive actions
- States: default, hover, active, disabled

### Cards
- White background, 16px radius, subtle shadow
- Hover: Slightly elevated shadow

### Badges/Pills
- Rounded full, small padding
- Color-coded by category
- Status badges: green (activo), gray (inactivo)

### Form Inputs
- Rounded borders, 40px height
- Focus: Blue ring
- Error: Red border + message

### Modal
- Centered, max-width 600px
- Dark overlay (rgba black 50%)
- Slide-up animation on open
- Close on overlay click or X button

### Table
- Sticky header
- Hover row highlights
- Action column with icon buttons
- Empty state with message

## 6. Technical Approach

### Stack
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Lucide React (icons)
- React Context for state management

### Architecture
```
/app
  /page.tsx (Welcome)
  /layout.tsx (Root)
  /dashboard
    /layout.tsx
    /page.tsx (Dashboard)
    /portfolios/page.tsx
    /clinics/page.tsx
    /quotation/page.tsx
    /settings/page.tsx
/components
  /layout
    /Sidebar.tsx
    /TopBar.tsx
    /DashboardLayout.tsx
  /portfolio
    /PortfolioTable.tsx
    /ServiceModal.tsx
    /CategoryBadge.tsx
  /import
    /ImportModal.tsx
/lib
  /types.ts
  /data.ts
  /store.tsx
```

### Data Model

**VeterinaryClinic**
```typescript
{
  id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  servicioDomicilio: boolean;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  fechaActualizacion: string;
}
```

**Service**
```typescript
{
  id: string;
  categoria: 'CONSULTA' | 'CIRUGIA' | 'LABORATORIO' | 'IMAGENES' | 'VACUNAS' | 'PROCEDIMIENTOS';
  nombre: string;
  descripcion: string;
  precio: number;
  proveedor: string;
  clinicaId: string;
  ciudad: string;
  modoServicio: 'EN_SEDE' | 'A_DOMICILIO' | 'AMBOS';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  fechaActualizacion: string;
}
```

**StoredData**
```typescript
{
  clinicas: VeterinaryClinic[];
  servicios: Service[];
  ultimaActualizacion: string;
}
```

## 7. Categories (Spanish)

| Category | Description |
|----------|-------------|
| CONSULTA | Consulta médica general |
| CIRUGIA | Intervenciones quirúrgicas |
| LABORATORIO | Análisis de laboratorio |
| IMAGENES | Rayos X, ecografías, diagnóstico |
| VACUNAS | Vacunas y profilaxis |
| PROCEDIMIENTOS | Procedimientos especiales |

## 8. Service Modes

| Mode | Spanish Label | Description |
|------|---------------|-------------|
| EN_SEDE | En Sede | Only at the clinic |
| A_DOMICILIO | A Domicilio | Only at client's location |
| AMBOS | Ambos | Available both ways |

## 9. Import JSON Format

```json
{
  "_comentario": "Estructura de importación para SIM Platform",
  "veterinarias": [
    {
      "nombre": "Veterinaria Ruffy",
      "ciudad": "Santa Marta",
      "direccion": "Cra 10 #15-20",
      "servicio_domicilio": true,
      "servicios": [
        {
          "nombre": "Consulta General",
          "categoria": "CONSULTA",
          "descripcion": "Evaluación médica completa",
          "precio": 45000,
          "modo_servicio": "AMBOS"
        }
      ]
    }
  ]
}
```

### Valid Categories for Import
- CONSULTA, CIRUGIA, LABORATORIO, IMAGENES, VACUNAS, PROCEDIMIENTOS

### Valid Modes for Import
- EN_SEDE, A_DOMICILIO, AMBOS

## 10. Pages

### 1. Welcome (/)
- Split layout landing page
- "Comenzar" CTA to dashboard

### 2. Dashboard (/dashboard)
- Stats cards (Veterinarias, Servicios, Activos, Inactivos)
- Quick actions links
- Recent services list
- Category distribution

### 3. Portfolios (/dashboard/portfolios)
- Full service management table
- Complete filter system
- CRUD modals

### 4. Veterinarias (/dashboard/clinics)
- Clinic management with cards
- Import JSON button
- Add/edit/disable clinics

### 5. Cotizaciones (/dashboard/quotation)
- Placeholder UI for future engine
- Preparation status checklist

### 6. Configuración (/dashboard/settings)
- Platform settings sections
- Placeholder for future options

## 11. State Management

- React Context for global app state
- localStorage for data persistence
- Auto-save on every data change
- Import/Export capabilities