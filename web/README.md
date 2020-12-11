# Web v1.0.0 Documentation

It's highly recommended to 
* open web as an angular cli project with existing sources in IDEA or your preferred editor
* install chrome/firefox extension [Augury](https://augury.rangle.io/)
* search [Angular CLI Documentation](https://angular.io/docs) first, before google for Angular CLI questions.
* **DO NOT SEARCH** AngularJS for anything, Angular 2+ or Angular CLI only.
* search [TypeScript Documentation](https://www.typescriptlang.org/docs) first, before google for TypeScript questions
* **DO NOT USE NPM, USE YARN**
* follow [Material design](https://material.io/components/text-fields#filled-text-field)
  * [grid system](https://daemonite.github.io/material/docs/4.1/layout/grid/)
Install NodeJS and yarn via [download](https://nodejs.org/en/download/) or your linux distro instructions
```
npm install -g @angular/cli
cd <path>/postexample/web
yarn install
ng serve --host 0.0.0.0 --disableHostCheck
```

To create a new component, use IDEA terminal and navigate to web's root folder
```
# cd /opt/postexample/web
ng generate component post --project app --module app
```
You'll also need to add it to `src/app/layouts/default-layout/default-layout.routing.ts`
