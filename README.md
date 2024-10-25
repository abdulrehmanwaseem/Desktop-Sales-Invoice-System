# Desktop Sales Invoice System

A streamlined desktop-based invoicing system built using Electron-Vite, React, Node.js, and the file system module, providing an intuitive experience for creating invoices, tracking sales, and managing item inventory—all stored locally on your PC.

## Technologies Used

- **Frontend:** React, Electron
- **Backend:** Node.js
- **Build Tool:** Electron-Vite
- **File Handling:** Node’s fs (file system) module
- **Inter-Process Communication (IPC):** Electron’s IPC for seamless frontend-backend communication

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Invoice Creation:** Create, save, and print invoices for various sales
- **Sales Tracking:** View and analyze total sales data
- **Item Management:** Add, update, and organize items in inventory
- **Offline Storage:** Store all data securely on the local PC
- **Desktop Integration:** Seamless desktop compatibility using Electron Builder
- **IPC Communication:** Fast and efficient communication between frontend and backend using Electron’s IPC

## Installation

To set up the application locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/Desktop-Sales-Invoice-System.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Desktop-Sales-Invoice-System
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   - Create a `.env` file in the root directory and include the necessary variables as shown below.

5. **Run the application:**

   ```bash
   npm run dev
   ```

## Usage

- Launch the app to start managing invoices and sales on your desktop.
- Use the intuitive interface to create invoices, view sales, and manage items.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
APP_PORT=your_app_port
DATA_STORAGE_PATH=your_data_storage_path
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, reach out to [Your Name](mailto:your.email@example.com).
