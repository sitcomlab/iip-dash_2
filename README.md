# IIP Commute Dashboard
This Project is a dashboard meant for the visualization of bicycle-based commuting infrastructure. It has the goal of giving cyclists an overview of the bikeability of their commute by using a variety of open data-sources. It is developed in the context of the Project [Intelligent Pendeln](https://www.intelligent-pendeln.de/).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Dependencies
(As of October 2024) this project depends on a backend system to fetch, process, and deliver the bicycle-infrastructure data from OpenStreetMap: (OSMBicycleInfrastructure)[https://github.com/niebl/OSMBicycleInfrastructure]

## Getting Started

ensure the backend is running.
create a `.env.local` as a copy of `env.example`. Ensure the URIs match up with the resources provided by the backend (by default these match the paths given in the example .env)

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[http://localhost:3000/muenster](http://localhost:3000/muenster) and [http://localhost:3000/osnabrueck](http://localhost:3000/osnabrueck) will show the dashboards for each city.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
