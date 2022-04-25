# Déploiement sur Ganache (ou Ropsten)

## ULTRASECURE Online Voting
![Voting01](https://user-images.githubusercontent.com/52157260/165035890-b74fef1b-ca10-42f2-a10e-58e95f3708b7.png)


## Installation et lancement

Truffle et Ganache doivent être installés.

A la racine :

```bash
npm install
cd client && npm install
```
Lancer Ganache dans un 1er terminal :

```bash
ganache-cli
```
Dans un 2nd terminal. A la racine :

```bash
truffle migrate --reset
cd client && npm start
```

## Utilisation
Metamask doit être installé.

Suivez les instructions suivant la procédure de vote dirigée par l'administrateur.

**Enregistrement des voteurs** par l'administratueur.

**Enregistrement des propositions** par chaque voteur enregistré.

**Session de vote** pendant laquelle chaque voteur peut voter 1 seule fois pour la proposition qui lui convient.

**Résultat des votes** affiche la proposition adoptée. Les résultats ex aequo sont calculés.
