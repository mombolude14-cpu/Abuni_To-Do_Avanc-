# 📌 Projet : To-Do App Avancée

## 🎯 Objectif

Créer une application de gestion de tâches moderne, performante et intuitive permettant à l’utilisateur de planifier, organiser et suivre ses activités quotidiennes.

---

## ⚙️ Stack Technique

* HTML5
* CSS3 (Flexbox + Grid)
* JavaScript (Vanilla)
* LocalStorage (persistance)
* Optionnel : API (si évolution)

---

## 🏗️ Architecture du projet

```
/todo-app
│
├── index.html
├── /css
│   └── style.css
├── /js
│   ├── app.js
│   ├── store.js
│   ├── ui.js
│   └── tasks.js
├── /assets
│   └── icons/
└── README.md
```

---

## 🔄 Ordre d'exécution

1. Chargement du DOM
2. Initialisation des données (LocalStorage)
3. Rendu des tâches
4. Ajout des événements (click, submit, drag)
5. Mise à jour dynamique UI + stockage

---

## 🧠 Modules

### 📦 store.js

* Gestion LocalStorage
* saveTasks()
* getTasks()
* deleteTask()
* updateTask()

---

### 📦 tasks.js

* Structure d’une tâche :

```
{
  id: string,
  title: string,
  description: string,
  completed: boolean,
  priority: "low" | "medium" | "high",
  category: string,
  dueDate: string,
  createdAt: date
}
```

---

### 📦 ui.js

* Affichage des tâches
* Filtres (all, completed, pending)
* Gestion du drag & drop
* Mise à jour visuelle

---

### 📦 app.js

* Point d’entrée
* Initialise l’application
* Connecte UI + logique

---

## ✅ Fonctionnalités principales

### 🔹 Gestion des tâches

* Ajouter / modifier / supprimer
* Marquer comme terminé

### 🔹 Organisation

* Catégories
* Priorités
* Sous-tâches (optionnel)

### 🔹 Filtres

* Toutes
* Terminées
* En cours
* Par priorité

### 🔹 Recherche

* Recherche dynamique en temps réel

### 🔹 Drag & Drop

* Réorganiser les tâches

---

## 💾 Persistance

* LocalStorage obligatoire
* Format JSON

---

## 📊 Statistiques

* Nombre total de tâches
* Tâches complétées
* Taux de progression

---

## 🔐 Règles de code

* Code modulaire
* Pas de code dupliqué
* Nommage clair
* Commentaires utiles
* Responsive obligatoire

---

## 🚀 Évolution possible

* Authentification utilisateur
* Synchronisation cloud
* Mode offline avancé
* Notifications
