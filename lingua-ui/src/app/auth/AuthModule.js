import angular from 'angular'
import { LoginController } from './LoginController'
import { RegistrationController } from './RegistrationController'
import { OauthService } from './OauthService'
import { UserService } from './UserService'
import { SecurityContext } from './SecurityContext'
import { TokenValidatingHttpInterceptor } from './TokenValidatingHttpInterceptor'
import '@uirouter/angularjs'

angular.module('auth', ['ui.router'])
    .controller('LoginController', LoginController)
    .controller('RegistrationController', RegistrationController)
    .service('OauthService', OauthService)
    .service('UserService', UserService)
    .service('SecurityContext', SecurityContext)
    .config(['$httpProvider', ($httpProvider) => {
        $httpProvider.interceptors.push(['SecurityContext', '$state',
            (securityContext, $state) => {
            return new TokenValidatingHttpInterceptor(securityContext, $state)
        }])
    }])
    .config(['$stateProvider', ($stateProvider) => {
        $stateProvider.state({
            name: 'login',
            url: '/login',
            templateUrl: '/app/auth/html/login.html',
            controller: 'LoginController as login'
        })
        $stateProvider.state({
            name: 'registration',
            url: '/registration',
            templateUrl: '/app/auth/html/registration.html',
            controller: 'RegistrationController as reg'
        })
    }])
