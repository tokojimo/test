# Images des champignons

Dépose ici les images utilisées par la liste de champignons affichée sur `/picker`.

Dans Vite, tout fichier placé dans `public/` est servi à la racine du site. Une image ajoutée ici avec le nom `cepe-de-bordeaux.jpg` sera donc référencée avec l'URL :

```ts
photo: "/images/mushrooms/cepe-de-bordeaux.jpg"
```

Les entrées de la liste se trouvent dans `src/data/mushrooms.ts` et utilisent la propriété `photo`.
