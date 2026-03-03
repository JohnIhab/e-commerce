# E-Commerce

A modern, feature-rich e-commerce application built with React and modern web technologies. This dashboard provides a complete shopping experience with product management, cart operations, user authentication, and order management.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login and registration with password recovery
- **Product Management**: Browse, search, filter, and compare products
- **Shopping Cart**: Add/remove items, manage quantities, and checkout
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders, track order status, and view invoices
- **Product Categories**: Browse products by categories
- **Flash Deals & Offers**: Time-limited deals and bundle offers
- **Advanced Search**: Search and filter products by various criteria
- **Product Comparison**: Compare multiple products side by side

### User Experience
- **Multi-language Support**: Internationalization (i18n) with Arabic and English
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for fluid UI transitions
- **Address Management**: Add and manage multiple delivery addresses
- **Loading States**: Skeleton loaders for better UX
- **Toast Notifications**: Real-time feedback with react-hot-toast

## 🛠️ Technology Stack

### Frontend Framework
- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **React Router 7** - Client-side routing

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Flowbite React** - UI component library
- **Styled Components** - CSS-in-JS library
- **Framer Motion** - Animation library

### State & Data Management
- **React Query** - Server state management and caching
- **Axios** - HTTP client for API requests
- **Context API** - Local state management

### Forms & Validation
- **Formik** - Form management
- **Yup** - Form validation schema

### Internationalization & Components
- **i18next** - Internationalization framework
- **react-i18next** - i18next integration for React
- **React Icons** - Icon library
- **Swiper** - Touch slider carousel
- **React to Print** - Print functionality
- **React Helmet** - Document meta tags management

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-design-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📦 Build & Deployment

- **Build production**
  ```bash
  npm run build
  ```

- **Preview production build**
  ```bash
  npm run preview
  ```

- **Lint code**
  ```bash
  npm run lint
  ```

## 📁 Project Structure

```
src/
├── Components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CartSideBar.jsx
│   ├── ProductCard/
│   ├── CategoryCard.jsx
│   └── ... other components
├── Pages/              # Page components for routes
│   ├── HomePage/
│   ├── ShopPage/
│   ├── CartPage/
│   ├── LoginPage/
│   ├── UserProfile/
│   ├── CheckoutPage/
│   └── ... other pages
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   ├── AddToCartContext.jsx
│   ├── GetWishList.jsx
│   ├── CompareContext.jsx
│   └── ... other contexts
├── Locales/            # Internationalization files
│   ├── en/translation.json
│   └── ar/translation.json
├── assets/             # Static images and media
├── Framermotion/       # Animation variants
├── App.jsx             # Main app component
├── main.jsx            # React DOM render
└── i18n.jsx            # i18n configuration
```

## 🔐 Key Context Providers

- **AuthContext** - User authentication state
- **AddToCartContext** - Shopping cart management
- **GetWishList** - Wishlist operations
- **GetAddresses** - User addresses management
- **CompareContext** - Product comparison state
- **CheckoutContext** - Order checkout process
- **Currency** - Currency/pricing context
- **CategoriesContext** - Product categories
- **CartUIProvider** - Cart UI state

## 🌐 Internationalization

The application supports multiple languages:
- **English (en)** - Default
- **Arabic (ar)** - Full RTL support

Language preference is auto-detected based on browser settings and can be switched via the UI.

## 🎨 Styling

- **Tailwind CSS** for utility-based styling
- **Custom CSS** modules for component-specific styles
- **Flowbite components** for pre-built UI elements
- **Framer Motion** for smooth animations

## 🔗 Routing

Main routes include:
- `/` - Home page
- `/shop` - Products listing
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/wishlist` - Saved wishlist
- `/checkout` - Order checkout
- `/profile` - User profile
- `/orders` - Order history
- `/login` - User login
- `/signup` - User registration
- `/about` - About page
- `/contact` - Contact page
- `/blogs` - Blog listing

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (< 640px)
- Tablets (640px - 1024px)
- Desktop (1024px+)

## 🚀 Performance Optimizations

- Lazy loading for routes
- Image optimization
- Code splitting with Vite
- React Query caching
- Skeleton loaders for better perceived performance

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure code passes linting: `npm run lint`
4. Submit a pull request

## 📄 License

This project is private. All rights reserved.

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ by John Ihab**
