# Rafiq رفيق : Ton compagnon islamique du quotidien
Application web **Quranique** réalisée dans le cadre du **TP N°1 : Web Service & Sécurité** (ISI M2, Université Djilali Liabès).
## Fonctionnalités
- **Date Hijri** du jour
- **Prochain événement islamique** avec le nombre de jours restants
- **Ayah du jour** (arabe + traduction), différente chaque jour
- **Dua selon l'humeur** (matin, voyage, stress, pardon, sommeil), avec bouton « Autre dua »
## Technologies
- HTML, CSS, JavaScript (sans framework)
- API REST publique : [UmmahAPI](https://ummahapi.com)

## Services de l'API utilisés
| Service | Endpoint |
|---|---|
| Date Hijri | `GET /api/today-hijri` |
| Evénements islamiques | `GET /api/islamic-events` |
| Ayah | `GET /api/quran/surah/{n}/ayah/{m}` |
| Duas | `GET /api/duas/category/{id}` |
## Architecture
Chaque fonctionnalité appelle un microservice indépendant d'UmmahAPI. Le navigateur joue le rôle d'**orchestrateur** : il appelle les services en parallèle et assemble les résultats dans une seule page.
## Lancer le projet
Ouvrir `index.html` dans un navigateur (connexion internet requise).
## Auteur
BENBAREK Madjda, ISI M2, Université Djilali Liabès
