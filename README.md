<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="public/logo-dark.svg" />
        <source media="(prefers-color-scheme: light)" srcset="public/logo.svg" />
        <img width="595.5" height="101.25" src="public/logo.svg">
    </picture>
</p>

---

# Ground Station Frontend 2026

> [!NOTE]  
> The information or structure of this repository is subject to change as planning continues.

## Development Setup

This is a standard Vite project with client-side React only. The project uses [pnpm](https://pnpm.io/), for faster and easier development. It also uses [Prettier](https://prettier.io/) to ensure a standard code style.

| Command        | Action                                        |
| :------------- | :-------------------------------------------- |
| `pnpm install` | Installs dependencies                         |
| `pnpm dev`     | Starts local dev server at `localhost:5123`   |
| `pnpm build`   | Build production version to `./dist/`         |
| `pnpm preview` | Preview your build locally, before deploying  |
| `pnpm ci:fix`  | Runs any autofixes for linting and formatting |
