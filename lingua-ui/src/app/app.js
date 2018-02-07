import 'babel-polyfill'
import './auth/AuthModule'
import './home/HomeModule'
import './lessons/LessonsModule'
import '@uirouter/angularjs'

angular.module('app', ['ui.router', 'auth', 'home', 'lessons'])
  .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/')
  }])
