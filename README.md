# VocaB.AI Website

A modern, responsive website for VocaB.AI, showcasing AI-powered analytics solutions for image, audio, and text data.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Interactive Components**:
  - Infinite scroll gallery carousel
  - Team member showcase carousel
  - Contact form
- **Optimized Performance**:
  - Next.js 13+ with App Router
  - Image optimization with next/image
  - Smooth transitions and animations
- **Google Authentication**:
  - Integrated AI services:
    - SARATHI-AI
    - CHITRA-AI
    - Vocab Assist (AI Voice Chat)

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components with modern design

## 📦 Project Structure

```
vocabai-website/
├── app/                   # Next.js app directory
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # React components
├── public/              # Static assets
│   ├── gallery1.jpeg
│   ├── gallery2.jpeg
│   ├── gallery3.jpg
│   └── team.jpg
└── styles/              # Additional styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- Python 3.x (for Vocab Assist feature)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vocabai-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with the following:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Key Features Explained

### Gallery Carousel
- Infinite scroll implementation
- Shows 5 images at a time (desktop), responsive for mobile
- Smooth transitions between slides
- Auto-scrolls every 2 seconds (pauses on hover)
- Navigation controls (chevrons)
- Overlay text/buttons visible on center or hover
- Mobile-friendly sizing and spacing
- **To update gallery images:** Edit the `galleryImages` array in `GalleryCarousel.tsx` or connect to your own data source.

### Team Section
- Showcases team members with images and roles
- Smooth carousel navigation
- Auto-scrolls every 2 seconds (pauses on hover)
- Overlay text visible on center or hover
- Responsive design for all screen sizes
- **To update team members:** Edit `app/data/teamMembers.ts` (add/remove members, update images/roles)

### Contact Form
- Clean, user-friendly design
- Form validation
- Social media links
- Business information display

### Vocab Assist
- AI-powered voice chat interface
- Real-time speech processing
- Automatic server startup
- Seamless integration with main website

To use Vocab Assist:
1. Log in to the website
2. Navigate to Services
3. Click on "Vocab Assist"
4. The voice chat interface will automatically start

## 📱 Mobile Customization & Responsiveness

- The carousels and all sections use responsive Tailwind CSS classes.
- Carousel containers use `h-[350px] sm:h-[500px]` for compact mobile height.
- Carousel cards use `w-[220px] h-[300px]` on mobile, `w-[300px] h-[400px]` on desktop.
- Overlay paddings and margins are reduced for mobile (`p-2`, `mx-1`).
- Navigation, section paddings, and negative margins are all responsive (e.g., `py-4`, `md:py-16`, `-mt-40 md:-mt-80`).
- To customize for mobile, use Tailwind's responsive prefixes (e.g., `sm:`, `md:`) in your component classes.

**Example:**
```jsx
<div className="-mt-40 md:-mt-80"> ... </div>
```

## 🛠️ How to Update Team Members and Gallery

- **Team Members:**
  - Edit `app/data/teamMembers.ts` to add, remove, or update team members.
  - Each member has a `name`, `role`, and `image` field.
  - Images should be placed in the `public/` directory and referenced by their path (e.g., `/team.jpg`).
- **Gallery Images:**
  - Edit the `galleryImages` array in `GalleryCarousel.tsx` to update images and captions.

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)


## 🛠️ Development

### Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

