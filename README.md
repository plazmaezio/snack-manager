# Snack Manager
![Status](https://img.shields.io/badge/status-in%20development-orange)

A web app built to manage the day-to-day operations of a snack bar - 
from ingredients and dishes to menus and purchases.

The app has three roles (Admin, Employee, and Client), each with their 
own set of permissions. Admins have full control, employees can manage 
the catalogue, and clients can view everything and track their own purchases.

## Tech Stack
- React
- TypeScript
- Tailwind

## Features
- **Authentication** - login flow with custom hook, context, and service layer
- **API abstraction layer** - centralised `api.ts` with typed **get/post/put/delete** methods
- **Typed API contracts** - TypeScript interfaces defined for all API requests and responses

  
## Running locally

1. Clone the repo and navigate to the project folder
2. Copy the environment file:
   - Mac/Linux: `cp .env.example .env`
   - Windows: `copy .env.example .env`
3. Fill in your values in `.env`
4. Install dependencies: `npm install`
5. Start the dev server: `npm run dev`
