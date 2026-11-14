Blinkit Outlet Insights Dashboard

🔗 **Live dashboard:** [kd-blinkit-dashboard.vercel.app](https://kd-blinkit-dashboard.vercel.app/)

💻 **GitHub repository:** [kunal-dushing/blinkit-dashboard](https://github.com/kunal-dushing/blinkit-dashboard)

An interactive sales and outlet performance dashboard built to explore Blinkit-style grocery retail data. Compare sales, products, and store performance with filters for outlet location tier and key business metrics.

> **Demo data notice:** The figures in this dashboard are illustrative sample data for demonstration. They are not official Blinkit sales data.

## Dashboard features

- **Key metrics:** total sales, average sales, items sold, and customer ratings
- **Sales trends:** explore sales over time and compare outlet tiers
- **Item analysis:** compare sales across grocery product categories
- **Outlet performance:** review sales by outlet type, location tier, size, and establishment year
- **Interactive filters:** adjust outlet tiers and the selected metric to update the dashboard

## Built with

- Next.js and React
- TypeScript
- Recharts for charts
- Lucide icons
- GitHub for source control
- Vercel for deployment

## Run locally

1. Install [Node.js](https://nodejs.org/) (LTS).
2. Open a terminal in this project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

To create a production build locally, run `npm run build`.

## Deployments

Connect the `main` branch to Vercel to deploy the dashboard. Vercel detects Next.js and uses the project defaults. Update the live dashboard link at the top of this README if your Vercel project uses a different domain.

## Project structure

- `app/page.tsx` — dashboard layout, interactions, charts, and sample data
- `app/globals.css` — colors, layout, and responsive styling
- `app/layout.tsx` — document metadata and global styles
- `next.config.ts` — Next.js configuration
- `package.json` — dependencies and project scripts
