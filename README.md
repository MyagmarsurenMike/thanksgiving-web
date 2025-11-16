# 🦃 Thanksgiving Message Website

A beautiful, interactive Next.js application where people can share their Thanksgiving gratitude messages with an admin approval system.

## ✨ Features

- **Public Message Board** - Display approved Thanksgiving messages
- **Interactive Submission** - Users can submit messages via Ant Design modal
- **Admin Approval System** - Moderate messages before they go live
- **MongoDB Integration** - Persistent data storage with MongoDB Atlas
- **Responsive Design** - Works beautifully on all devices
- **Thanksgiving Theme** - Warm autumn colors and festive styling

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **UI Library:** Ant Design
- **Styling:** Tailwind CSS
- **Hosting:** Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thanksgiving-message-website.git
   cd thanksgiving-message-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thanksgiving_messages?retryWrites=true&w=majority
   
   # NextAuth (for future authentication features)
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### Public Interface
- Visit the homepage to see approved Thanksgiving messages
- Click "Share Your Gratitude" to submit your own message
- Messages include name, gratitude text, and emoji selection

### Admin Panel
- Access the admin panel at `/admin`
- Review pending messages
- Approve or delete submissions
- Manage all messages in the system

## 🗂️ Project Structure

```
thanksgiving_web/
├── components/
│   └── SubmitMessageModal.tsx    # Message submission modal
├── lib/
│   └── mongodb.ts                # Database connection
├── models/
│   └── Message.ts                # Mongoose message schema
├── scripts/
│   └── seed.ts                   # Database seeding script
├── src/app/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── admin/
│   │   └── page.tsx              # Admin panel
│   └── api/
│       ├── messages/             # Public message endpoints
│       └── admin/                # Admin-only endpoints
└── types/
    └── global.d.ts               # TypeScript definitions
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind classes in components
- Customize Ant Design theme in components

### Data
- Edit `scripts/seed.ts` to change sample messages
- Modify `models/Message.ts` to add new fields
- Update API routes for new functionality

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy automatically**

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ for Thanksgiving 2024
- Ant Design for beautiful UI components
- MongoDB Atlas for reliable cloud database
- Next.js team for the amazing framework

---

**Happy Thanksgiving! 🦃🍂**
