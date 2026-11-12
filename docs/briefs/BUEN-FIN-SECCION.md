# Sección "Buen Fin" en la web de ShopTire

> Para la **IA ejecutora** de `shoptire-web` (Next 14, Vercel). Planner, 2026-11-12. Lo pidió Ray: el jefe quiere promocionar en la web, para el Buen Fin (13–17 nov 2026), las llantas **Sunfull/Longtrack** (lista del proveedor) y **Davanti** (compradas a Futurama).

## ⚠️ CAMBIO 2026-11-12: la promo es SOLO en la sucursal Tlalpan (manda sobre lo de abajo)
Decisión de Ray: el Buen Fin es **solo en ShopTire Tlalpan** (Viaducto Tlalpan 78 A), del 13 al 17 de noviembre, con **15% de regreso en saldo para la próxima compra**. Aplica a todas las llantas del inventario de Tlalpan; en la web se anuncian estas 12.
- `docs/briefs/buen-fin-llantas.json` ahora trae **solo 12 llantas**, con:
  - `precioBuenFin`: lo que se cobra en caja, ya calculado como precio ÷ 0.85;
  - `cashback`: el 15% que regresa como saldo;
  - `disponible: "Tlalpan"`.
- **Encabezado:** solo **ShopTire Tlalpan · Viaducto Tlalpan 78 A**. Quita Ajusco y la etiqueta "Disponible en Ajusco".
- **Tarjeta:** precio grande `$1,244` y debajo, en verde, **"+ $187 de regreso para tu próxima compra"**.
- **Leyenda fija:** "Promoción válida solo en sucursal Tlalpan, del 13 al 17 de noviembre de 2026 o hasta agotar existencias. El 15% se entrega como saldo a favor para tu próxima compra en la sucursal Tlalpan, ligado a tu número de teléfono. No aplica con meses sin intereses ni crédito. No se cambia por efectivo."
- **WhatsApp:** Ray te da el número de Tlalpan. Hasta entonces, déjalo en la constante `WA_TLALPAN` con el valor `5215570601568` y un `// TODO número Tlalpan`.
- Los filtros por marca y rin siguen igual (quita Longtrack si no hay).

## Datos (ya cruzados con Nexus, solo lectura)
- `docs/briefs/buen-fin-llantas.json`: **41 llantas publicables**.
  - Cada una trae `marca`, `modelo`, `medida`, `descripcion`, `precio` (precio público de Nexus Ajusco; si Ajusco no tiene precio, el de Tlalpan), `existenciaAjusco` y `existenciaTlalpan`.
- Se dejaron **fuera** 10: sin existencia en Nexus, precio menor al costo o costo dudoso. Ray las revisa; **no las agregues**.
- El **costo nunca se publica**. No está en el JSON y no debe estar en la página.

## Qué hacer
1. Copia el JSON a `app/buen-fin/llantas.ts` como arreglo tipado (`export const LLANTAS_BUEN_FIN = [...] as const`). Datos estáticos: la promo dura 5 días y así no depende del backend.
2. Página nueva **`/buen-fin`**, con el mismo estilo de `/promos` (fondo negro, móvil primero):
   - **Encabezado:** "🔥 BUEN FIN · 13 al 17 de noviembre" y las dos sucursales:
     - **ShopTire Ajusco** (Héroes de Padierna);
     - **ShopTire Tlalpan** (Viaducto Tlalpan 78 A).
   - Si existe `public/promos/buen-fin.jpg`, la imagen de la campaña arriba. Ray la va a poner; si no está, no se muestra nada roto.
   - **Filtros:**
     - chips por **rin** (14, 15, 16, 17, 18, 19, 20, camión), sacados de la medida;
     - chips por **marca** (Sunfull, Davanti, Longtrack);
     - un buscador de medida que acepte "205/55r16", "205 55 16" y "2055516".
   - **Tarjeta por llanta:** marca, modelo, medida grande y **precio** con formato `$1,080`. Indica **"Disponible en Ajusco"**, **"Disponible en Tlalpan"** o ambas, según la existencia > 0. **No muestres el número de piezas.**
   - Botón por tarjeta **"La quiero"**: abre WhatsApp `5215570601568` con el texto "Hola, vi en el Buen Fin la llanta {marca} {modelo} {medida} a ${precio}. ¿Me la aparto?".
   - **Pie fijo:** "✅ Instalación · Balanceo · Válvulas · Nitrógeno — gratis" y "Precios válidos del 13 al 17 de noviembre de 2026 o hasta agotar existencias".
   - Orden: por rin y luego por medida.
3. **Enlaces:**
   - un banner en la página principal (`app/page.tsx`), arriba del selector de medida: "🔥 Buen Fin: llantas Sunfull y Davanti — Ver ofertas →", que lleve a `/buen-fin`;
   - el mismo enlace en `/promos`.
4. **SEO:** `metadata` con título "Buen Fin 2026 — Llantas Sunfull y Davanti | ShopTire", Open Graph con la imagen si existe, y `/buen-fin` en `app/sitemap.ts`.
5. **Apagar al terminar:** constante `BUEN_FIN_HASTA = "2026-11-18T06:00:00Z"` (fin del 17 en CDMX). Después de esa fecha, el banner de inicio se oculta y `/buen-fin` muestra "El Buen Fin terminó" con un botón al catálogo normal. **No borres la página.**

## Reglas
- **Nunca** el nombre del proveedor (Futurama, etc.) en la página. Al cliente se le dice "nuestra bodega".
- No toques el catálogo, los pedidos, Mercado Pago ni el backend (`/web/*`).
- Si Ray manda la decisión del cashback 15% antes de publicar, **no la inventes en la página**. Eso se agrega aparte cuando él lo confirme.

## Verificación
- `npm run build` sin errores.
- En celular (390 px) y escritorio, con capturas de: la página, el filtro por rin 17, la búsqueda "205/55r17" y el enlace de WhatsApp de una tarjeta (muestra la URL).
- Que la página no tenga ningún costo ni nombre de proveedor: `grep -i "futurama\|costo" app/buen-fin` debe salir vacío.
- Simula una fecha posterior a `BUEN_FIN_HASTA` y confirma que sale "El Buen Fin terminó" y el banner de inicio se oculta.

## Qué reportar
Commit, `git show --stat` y las capturas. **Push solo cuando lo apruebe** (Vercel publica al hacer push).
