# 🤝 Guide de contribution – Transcendance

Merci de contribuer au projet ! Voici quelques règles simples pour maintenir un code propre et cohérent.

---

## 🧪 Avant de commencer

- Assurez-vous que le projet se lance localement (`docker compose up`).
- Familiarisez-vous avec la structure des dossiers.
- Lisez le `README.md`.

---

## 🛠️ Workflow Git

1. **Créer une branche**
   ```bash
   git checkout -b feat/nom-de-ta-feature
   ```

2. **Coder**
   - Suivre l’architecture déjà en place.
   - Utiliser des noms de variables clairs.
   - Ajouter des commentaires si besoin.

3. **Commit**
   - Commits clairs et concis :
     ```bash
     git commit -m "feat: ajout du matchmaking 1v1"
     ```

4. **Push & Pull Request**
   ```bash
   git push origin feat/nom-de-ta-feature
   ```
   - Crée ensuite une Pull Request vers `main` ou `dev`.

---

## 🧼 Convention de code

### Frontend
- React + Tailwind
- ESLint / Prettier configurés
- Composants réutilisables et typés

### Backend
- NestJS modulaire
- Typescript only, nommage en camelCase
- Fichiers `.spec.ts` pour les tests

### Tests
- Utiliser Jest
- Tests dans `/__tests__/` ou fichiers `*.spec.ts`

---

## ✅ Checklist pour une PR

- [ ] Code testé localement
- [ ] Pas d'erreurs ESLint
- [ ] PR bien nommée
- [ ] Description claire de ce que ça fait

---

Merci 🙏
