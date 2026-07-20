# Contributing to AI Defender Enterprise

We welcome contributions from the community! Here’s how you can help:

---

## **🛠️ How to Contribute**
1. **Fork** the repository.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/AI-Defender-Enterprise.git
   ```
3. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature
   ```
4. **Commit** your changes:
   ```bash
   git commit -m "Add your feature"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature
   ```
6. **Open a Pull Request** to the `dev` branch of the main repository.

---

## **📜 Code Style**
### **Backend (Python)**
- Use **[Black](https://github.com/psf/black)** for code formatting:
  ```bash
  pip install black
  black backend/
  ```
- Use **[isort](https://github.com/PyCQA/isort)** for import sorting:
  ```bash
  pip install isort
  isort backend/
  ```
- Use **[flake8](https://github.com/PyCQA/flake8)** for linting:
  ```bash
  pip install flake8
  flake8 backend/
  ```

### **Frontend (TypeScript/React)**
- Use **[Prettier](https://prettier.io/)** for code formatting:
  ```bash
  npm install --save-dev prettier
  npx prettier --write frontend/src/
  ```
- Use **[ESLint](https://eslint.org/)** for linting:
  ```bash
  npm install --save-dev eslint
  npx eslint frontend/src/
  ```

---

## **🧪 Testing**
### **Backend**
- Write **unit tests** using **[pytest](https://docs.pytest.org/)**:
  ```bash
  pip install pytest
  pytest tests/backend/
  ```

### **Frontend**
- Write **component tests** using **[Jest](https://jestjs.io/)** and **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**:
  ```bash
  npm test
  ```

---
## **📋 Pull Request Guidelines**
- **Title**: Use a clear, descriptive title (e.g., "Add YARA rule engine").
- **Description**: Explain the changes and their purpose.
- **Tests**: Include tests for new features/fixes.
- **Screenshots**: Add screenshots for UI changes.
- **Linked Issues**: Reference any related issues (e.g., `Fixes #123`).