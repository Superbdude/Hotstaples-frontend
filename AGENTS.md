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

- Keep customer commerce data in Lovable Cloud with row-level access rules; local storage is limited to guest cart and recently viewed state, so accounts sync safely.
- Keep administrator roles in `user_roles` and enforce mutations through database policies; client route guards are presentation only.
- Keep the four commerce departments represented by the shared `Department` model so catalog, checkout, inventory, and reporting remain aligned.
- Serve the shared login background video through its asset pointer with muted inline playback and a reduced-motion still fallback, so both login entry points behave consistently.
