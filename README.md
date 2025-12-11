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
This project is deployed using Docker containers managed by a Kubernetes cluster. The following section documents the required tools, the deployment workflow, and recommended monitoring commands.

### Prerequisites

Before deploying, ensure the following tools are installed locally:

- kubectl (command-line tool for communicating with the Kubernetes cluster)

- Docker (for building locally before pushing)

- Node.js (to run build scripts)

- Access credentials for the target Kubernetes environment

Once your access credentials are configured, you must authenticate/log in before using kubectl. This login process is required regularly depending on the cluster's authentication policy.

### Deployment Workflow

#### Build & publish images: 

The project includes automated scripts that build and publish Docker images to the container registry used by the Kubernetes cluster.

```bash
npm run prep_deploy
npm run push_containers
```

These commands:

- Build the Docker images from the current project source code.

- Push the images to the configured container registry (e.g., GitLab Container Registry).

After the registry is updated, Kubernetes will automatically pull these new images during pod restarts or redeployments.

#### Monitor deployment and Debug if needed:

Once deployed, you can monitor your Kubernetes pods and services using the following commands.

```bash
kubectl get pods
watch kubectl get pods
kubectl describe pod <podname>
kubectl logs -f <podname>
kubectl exec -it <podname> -- bash
kubectl get events
```
These commands can be used to list pods, inspect pods, view logs, view cluster events.

#### Updating a Deployed Container Image

If you push a new version of a container image without modifying Kubernetes config files, the cluster may continue running the older image until the affected pods are restarted.

To force Kubernetes to pull and run the new image, delete the existing pod:

```bash
kubectl delete pod <podname>
```
Kubernetes will automatically recreate the pod using the latest image from the container registry.