# Auto-Commit & Push Rule

Whenever any changes, bug fixes, or new features are completed and verified:
1. Automatically build/validate the project (`npm run build`).
2. Stage all modified and new project files (`git add`).
3. Commit with a clear, descriptive conventional commit message (`git commit -m "..."`).
4. Automatically push directly to `origin main` (`git push origin main`) so live deployments (Render, GitHub Pages) trigger immediately without requiring manual prompt from the user.
