# Aroma Atelier Display

Build a complete, premium frontend e-commerce website called HOTSTAPLE.

HOTSTAPLE is a luxury perfume retail boutique selling curated fragrances from high-end brands (HOTSTAPLE curates, does not manufacture).

STRICTLY FRONTEND ONLY:
- No backend, no server, no Express, no Node server, no APIs
- Absolutely NO Supabase, Firebase, MongoDB, PostgreSQL, Prisma, or databases
- No backend authentication; no real payment processing
- Built purely with React, Tailwind CSS, TypeScript, React Router, Framer Motion, Lucide icons, Context API, and localStorage for client-side persistence

DESIGN & BRAND IDENTITY:
- Aesthetic: Feminine, elegant, luxurious, modern, soft, warm, editorial boutique feel
- Color Palette: Warm white, ivory, soft beige, subtle champagne, soft blush/dusty rose accents, dark charcoal text (never oversaturated pink)
- Typography: High-contrast luxury editorial styling, serif/sans pairing, generous whitespace, subtle gold/champagne borders and delicate shadows
- Imagery: High-fashion, luxury perfume bottle photography (using curated Unsplash fragrance URLs)

CORE ROUTES & USER EXPERIENCES:
1. Home (`/`):
   - Campaign hero section with signature headline: "Find the Scent That Becomes Your Signature", luxury fragrance imagery with subtle floating motion, call-to-actions
   - Curated category cards: Women's, Men's, Unisex, Luxury, Best Sellers, New Arrivals
   - Featured products grid with hover zoom, quick add to bag, wishlist toggle, ratings, and price tags
   - Editorial brand story section highlighting curated authenticity and personal expression
   - Customer reviews/testimonials and newsletter signup ("Stay in the Scent")
   - Premium footer with navigation links, customer service, and social handles
2. Shop Catalog (`/shop`):
   - Multi-faceted working frontend filter system: Category, Gender, Brand, Fragrance Family (Floral, Woody, Oriental, Fresh, Gourmand), Price range, and Rating
   - Sorting options: Featured, Newest, Price low to high, Price high to low, Rating, Popularity
   - Search bar with live instant filtering
   - Desktop sidebar filters + mobile responsive filter drawer
   - Elegant skeleton loaders and zero-result empty state
3. Product Details (`/product/:id`):
   - Image gallery, brand name, perfume name, pricing, stock badge, quantity selector
   - Add to Cart, Buy Now, and Wishlist actions with toast feedback
   - Fragrance pyramid breakdown: Top Notes, Heart Notes, Base Notes
   - Fragrance family, longevity, sillage, bottle sizes (e.g., 50ml, 100ml)
   - Related fragrances carousel/grid
4. Cart (`/cart`) & Slide-over Drawer:
   - Full cart management: add/remove, quantity adjustments, item subtotals, calculated shipping, total
   - Persisted across reloads in localStorage
   - Rich empty cart state
5. Checkout Simulation (`/checkout`):
   - Form for customer details and delivery address with validation
   - Order summary with item previews
   - Simulated "Place Order" generating realistic order ID (e.g., `HOT-20260921-001`) saved to localStorage
6. Order Confirmation (`/order-confirmation`) & Tracking (`/track-order`):
   - Receipt with order details, items, shipping info, and link to track
   - Interactive order tracking timeline: Order Placed -> Confirmed -> Processing -> Ready for Delivery -> Out for Delivery -> Delivered
   - Input to track by order number, reading dynamically from localStorage
7. Customer Account (`/account`):
   - Profile overview, My Orders (with status badges), Wishlist items, Recently Viewed
8. About (`/about`) & Contact (`/contact`):
   - Dedicated storytelling page celebrating curated niche & designer fragrances
9. Admin Dashboard (`/admin` and sub-routes):
   - Navigation to /admin visible from account or footer
   - Dashboard Overview: KPI cards (Total Sales, Total Orders, Pending, Delivered, Total Products), interactive charts (sales trends, order status breakdown)
   - Products Manager (`/admin/products`): Add/Edit/Delete products via modal, filter/search, manage stock and tags (Featured, Bestseller), saved in localStorage
   - Orders Manager (`/admin/orders`): View orders, filter by status, and dropdown to change status (updating localStorage so tracking reflects it immediately)
   - Inventory (`/admin/inventory`): Stock levels, low-stock warnings, inline stock adjustments
   - Customers & Analytics views with demo metrics

ARCHITECTURE & QUALITY:
- Clean modular structure (`src/components`, `src/pages`, `src/context`, `src/data`, `src/types`, `src/utils`)
- Pre-populated with realistic, luxury perfume catalog data (Chanel, Dior, Maison Francis Kurkdjian, Tom Ford, Byredo, Le Labo, Creed, etc.)
- Fully responsive across mobile (320px–414px), tablet, and desktop
- Smooth micro-interactions, accessible UI, and polished toast feedback

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e0abd33d-7ca7-4078-88bb-02400b53eca7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
