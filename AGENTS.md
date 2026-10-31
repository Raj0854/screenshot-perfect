<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Business data, services and gallery live in src/lib/site.ts until moved to the database; keeps content in one place for the admin migration.
- Site shell (header, footer, WhatsApp button) is in src/components/site/Layout.tsx wrapped in __root; every page shares it.
