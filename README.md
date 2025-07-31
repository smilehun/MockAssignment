# Sakai19 - Enhanced Admin Dashboard

A modern, feature-rich admin dashboard built with Angular 19, PrimeNG, and Tailwind CSS. This project provides a comprehensive solution for user management, analytics, and administrative tasks.

## 🚀 Features

- **Modern Angular 19** with standalone components
- **PrimeNG UI Components** with Tailwind CSS styling
- **Role-based Access Control** using CASL
- **Real-time Analytics Dashboard** with charts
- **User Management System** with administrative tools
- **Global Error Handling** and loading states
- **Responsive Design** for all devices
- **Comprehensive Testing** setup
- **TypeScript** with strict typing

## 🛠️ Tech Stack

- **Frontend**: Angular 19, TypeScript, PrimeNG, Tailwind CSS
- **State Management**: RxJS BehaviorSubject
- **Authorization**: CASL
- **Testing**: Jasmine, Karma
- **API**: JSON Server (mock backend)
- **Build Tools**: Angular CLI, Webpack

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sakai-ng-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   This will start both the Angular dev server and JSON Server concurrently.

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with mock API |
| `npm start` | Start Angular development server |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run analyze` | Analyze bundle size |

## 🏗️ Project Structure

```
src/
├── app/
│   ├── guards/           # Route guards
│   ├── interceptors/     # HTTP interceptors
│   ├── layout/          # Layout components
│   ├── pages/           # Page components
│   ├── services/        # Business logic services
│   └── shared/          # Shared components & utilities
├── assets/              # Static assets
└── environments/        # Environment configurations
```

## 📊 Dashboard Features

- **Real-time Statistics**: User counts, activity metrics
- **Interactive Charts**: Line and doughnut charts using PrimeNG Charts
- **User Management**: Administrative tools with role-based permissions
- **Recent Activity**: Latest user logins and actions
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🧪 Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build
```bash
npm run build:prod
```

### Bundle Analysis
```bash
npm run analyze
```

## 🔧 Configuration

### Environment Variables
- `environment.ts` - Development configuration
- `environment.prod.ts` - Production configuration

### API Configuration
The application uses JSON Server as a mock backend. Configure the API URL in `src/environments/environment.ts`.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using Angular 19, PrimeNG, and Tailwind CSS**
