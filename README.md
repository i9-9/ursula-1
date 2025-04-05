# Ursula Benavidez Portfolio

An elegant and minimalist portfolio website for Ursula Benavidez, art director and set designer.

## Features

- Responsive design for all devices
- Minimalist, elegant layout with focus on visual content
- Contentful CMS integration for content management
- Smooth animations and transitions
- Single page application with section navigation

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- Contentful CMS
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Contentful account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the `.env.local.example` file to `.env.local` and add your Contentful credentials:
   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Contentful Setup

The project requires the following content models in Contentful:

### Project
- `title` (Text)
- `client` (Text)
- `year` (Text)
- `role` (Text)
- `mainImage` (Media)
- `additionalImages` (Media, multiple)
- `description` (Rich Text)
- `featured` (Boolean)
- `priority` (Number)
- `slug` (Text)
- `date` (Date)

### ArchiveProject
- `title` (Text)
- `client` (Text)
- `year` (Text)
- `category` (Text)
- `link` (Text, optional)

### HeroItem
- `image` (Media)
- `title` (Text)
- `order` (Number)

## Development

The site is structured as a single-page application with the following sections:
- Hero/Marquee
- Featured Works
- Other Projects Grid
- Archive
- Contact

## Deployment

The site can be deployed to Vercel or other hosting platforms that support Next.js.
