# Angular Blog

## Project made with Angular 13

Fully featured Blog using Angular 13 + Angular material and Node.js + MongoDB in the backend

This is a real world example app project that you can learn from, extendend and adapt to suit your needs.

## This project includes:

1 -  Real time notifications with Comet approach however doesn't add any extra overhead to the application/server or latency, since it uses MongoDB Atlas which is cloud-based and it also takes adavantage of `db watch`, which is a function that notifies the bckend whenever a particular document has changed, you may define your own filters.

2 - Ckeditor WYIWYG Editor.

3 -  ApexCharts for data visualization.

4 - Articles CRUD.

5 - Comments section.


# To run this Project

In frontend folder, run: `npm install`, then `ng serve`

In backend folder, run: `npm install`, then `npm start`

Live working project here: https://blog-ang.herokuapp.com/ 

You can create an account if you want to just to test it out and delete it anytime!

It was a vey fun project to made and very chanlleging as well, since the documentation on Angular Universal was oudated and no one had an answer on how to use third-party libraries with Angular Universal (SSR - Server Side Rendering) since it's required to deploy applications and window object doesn't exist on server side. But I did manage to find a way.
