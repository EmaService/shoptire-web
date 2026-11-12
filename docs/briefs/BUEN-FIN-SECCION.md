# Sección "Buen Fin" en la web de ShopTire (v2: elegir sucursal)

> Para la **IA ejecutora** de `shoptire-web` (Next 14, Vercel). Planner, 2026-11-12. **Reemplaza la versión anterior completa.**
> Buen Fin: **13 al 17 de noviembre de 2026**. Llantas **Sunfull, Davanti y Longtrack** en promoción.

## Qué quiere Ray
En `/buen-fin` el cliente ve las llantas en promoción y **elige la sucursal** con una pestaña arriba:

| | **Ajusco** | **Tlalpan** |
|---|---|---|
| Precio | Precio normal de Ajusco | Precio de Buen Fin (ya calculado por Nexus) |
| Extra | Instalación, balanceo, válvulas y nitrógeno gratis; **alineación gratis desde 2 llantas** | **15% de regreso** en saldo para su próxima compra (válido 365 días) + los mismos servicios gratis |
| Disponibilidad | "Disponible en Ajusco" | "En tienda" o **"Llega al día siguiente"** (viene de Ajusco por traslado) |
| Botón | **"La quiero en Ajusco"** → WhatsApp de Ajusco | **"Apartar en Tlalpan"** → formulario (abajo) |

## Datos: en vivo desde Nexus (la versión anterior usaba un JSON estático y ya no)
- Ruta de servidor `app/api/buen-fin/route.ts`, que llama `GET {NEXUS_URL}/api/public/buen-fin` con el header `x-api-key: {NEXUS_BUEN_FIN_KEY}`. Caché de 60 s (`revalidate: 60`). **La llave nunca va al navegador.**
- Respuesta (la define el brief de Nexus `BUEN-FIN-API-WEB-BOT.md`):
  - `{ activo, desde, hasta, cashback: { pct }, llantas: [...] }`;
  - cada llanta: `{ id, marca, modelo, medida, descripcion, ajusco: { disponible, precio }, tlalpan: { enTienda, llegaManana, precio, cashback } }`.
- Variables nuevas en Vercel, que pone Ray: `NEXUS_URL=https://nexus-erp-orcin.vercel.app` y `NEXUS_BUEN_FIN_KEY` (la misma llave del bot de Ajusco; se la paso yo a Ray).
- Si Nexus no responde: "Estamos actualizando las promociones" y el botón de WhatsApp. **Nunca precios inventados.**
- `docs/briefs/buen-fin-llantas.json` queda **solo como referencia**; no lo uses en la página.

## Página `/buen-fin` (móvil primero, estilo de `/promos`: fondo negro, acentos rojo y amarillo)
1. **Encabezado:** "🔥 BUEN FIN · 13 al 17 de noviembre". Si existe `public/promos/buen-fin.jpg`, va arriba.
2. **Pestañas de sucursal** grandes: **"📍 Ajusco"** | **"📍 Tlalpan · 15% de regreso"**.
   - Abre en Tlalpan si la URL trae `?sucursal=tlalpan`; si no, en Ajusco. Guarda la elección en `localStorage`.
   - Debajo, la dirección de la sucursal elegida:
     - **Ajusco:** Huehuetán 286, Tlalpan, CDMX;
     - **Tlalpan:** Viaducto Tlalpan 78 A, Huipulco, CDMX.
3. **Filtros:** chips por **rin** (14…20 y camión), chips por **marca** y un buscador de medida que acepte "205/55r16", "205 55 16" y "2055516".
4. **Tarjeta:**
   - marca, modelo y medida grande;
   - **precio de la sucursal elegida** con formato `$1,244`;
   - en **Tlalpan**, debajo en verde: "**+ $187 de regreso** para tu próxima compra";
   - disponibilidad según la sucursal. En Ajusco, si no está disponible, la tarjeta sale gris con "Agotada en Ajusco · disponible en Tlalpan". **Nunca el número de piezas.**
5. **Botones:**
   - **Ajusco** → WhatsApp `5215570601568` con: "Hola, vi en el Buen Fin la {marca} {modelo} {medida} a ${precio} en Ajusco. ¿Me la aparto?".
   - **Tlalpan, en tienda** → WhatsApp de Tlalpan (constante `WA_TLALPAN`; Ray da el número; mientras, `5215570601568` con `// TODO`), con el texto equivalente que diga Tlalpan y el 15%.
   - **Tlalpan, llega al día siguiente** → abre un formulario pequeño: nombre, teléfono a 10 dígitos y piezas (1–8). Al enviar llama a `app/api/buen-fin/apartar/route.ts` (servidor), que reenvía a `POST {NEXUS_URL}/api/public/buen-fin/apartar-tlalpan` con la llave.
     - Si sale bien: "✅ ¡Listo! Te la traemos a Tlalpan. Llega al día siguiente; te llamamos para confirmar." y un botón opcional de WhatsApp de Tlalpan.
     - Si hay error, muestra el mensaje de Nexus ("Ya la apartaste", "Solo hay N").
6. **Leyendas fijas:**
   - **Ajusco:** "Instalación, balanceo, válvulas y nitrógeno gratis. Alineación gratis en la compra de 2 llantas o más."
   - **Tlalpan:** "Promoción válida solo en sucursal Tlalpan del 13 al 17 de noviembre de 2026 o hasta agotar existencias. El 15% se entrega como saldo a favor para tu próxima compra en Tlalpan, ligado a tu teléfono, válido 365 días. No aplica con meses sin intereses ni crédito. No se cambia por efectivo."
7. **Enlaces:** banner en la portada (`app/page.tsx`) "🔥 Buen Fin: Sunfull y Davanti — Ver ofertas →" y el mismo enlace en `/promos`. `/buen-fin` va en `sitemap.ts`, con metadata y Open Graph.
8. **Fin de la promo:** si `activo` es false después del 17, la página dice "El Buen Fin terminó" con un botón al catálogo, y el banner de la portada se oculta. **No borres la página.**

## Reglas
- **Nunca** el proveedor (Futurama u otro) ni el costo en la página: `grep -ri "futurama\|costo" app/buen-fin` debe salir vacío.
- No toques el catálogo, los pedidos, Mercado Pago ni `/web/*` del backend.
- **Antiabuso** del formulario: el botón se deshabilita mientras envía, y el teléfono se valida en el navegador y en el servidor.

## Verificación
- `npm run build` sin errores.
- Con Nexus del banco local (o un servidor falso con el JSON del brief de Nexus), manda capturas en 390 px de:
  - pestaña Ajusco;
  - pestaña Tlalpan con "Llega al día siguiente";
  - formulario enviado;
  - error "Ya la apartaste";
  - filtro rin 17;
  - Nexus caído.
- **No hagas push hasta que lo apruebe** (Vercel publica al hacer push).
