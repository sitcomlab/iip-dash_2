# IIP Commute Dashboard
This Project is a dashboard meant for the visualization of bicycle-based commuting infrastructure. It has the goal of giving cyclists an overview of the bikeability of their commute by using a variety of open data-sources. It is developed in the context of the Project [Intelligent Pendeln](https://www.intelligent-pendeln.de/).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Dependencies
(As of October 2024) this project depends on a backend system to fetch, process, and deliver the bicycle-infrastructure data from OpenStreetMap: (OSMBicycleInfrastructure)[https://github.com/niebl/OSMBicycleInfrastructure] and another backend system for processing bike routes and sensor data from the OpenSenseMap: (IP-OSeM-Backend)[https://github.com/Rajasirpi/IP-OSeM-Backend]

## Getting Started

### initialize submodules
To ensure proper functionality, pull the submodules after cloning the repository
```bash
git submodule update --init --recursive
```

If you wish to pull new changes that have been made on the remote repository of the submodules, run the following:
```bash
git submodule update --recursive --remote
```

For more info on submodules, consult [git-scm.com/book/en/v2/Git-Tools-Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

### create docker images
as the backend components of this application have been containerized, run the following command to create the needed docker images

```bash
npm run prep
```

This will need to be executed with every new change to the backend submodules

### run development server
to run the development server, the following command starts the backend docker containers, as well as the react development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[http://localhost:3000/muenster](http://localhost:3000/muenster) and [http://localhost:3000/osnabrueck](http://localhost:3000/osnabrueck) will show the dashboards for each city.

## Project Structure
pages are defined under `/src/app/{pagename}/page.js`. there, for instance the pages for münster and osnabrück can be found respectively.

## Deployment
TO DO
