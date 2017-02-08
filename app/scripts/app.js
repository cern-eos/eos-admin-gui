'use strict';

/**
 * @ngdoc overview
 * @name urbanApp
 * @description
 * # urbanApp
 *
 * Main module of the application.
 */
angular
  .module('urbanApp', [
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'oc.lazyLoad',
    'ngStorage',
    'ngSanitize',
    'ui.utils',
    'ngTouch',
    'angularUtils.directives.dirPagination'
  ])
  .constant('COLORS', {
    'default': '#e2e2e2',
    primary: '#09c',
    success: '#2ECC71',
    warning: '#ffc65d',
    danger: '#d96557',
    info: '#4cc3d9',
    white: 'white',
    dark: '#4C5064',
    border: '#e4e4e4',
    bodyBg: '#e0e8f2',
    textColor: '#6B6B6B',
  }).constant('EOS_MGM_REST_CONFIG', {
    baseUrl: 'https://p05614910a92540.cern.ch',
    port: '443',
    pollingInterval: '100000',
  })
  .filter('mathPow', function(){
    return function(base, exponent){
        return Math.pow(base, exponent);
    };
  })
  .filter( 'filesize', function () {
      var units = [
        'bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
      ];

      return function( bytes, precision ) {
        if ( isNaN( parseFloat( bytes )) || ! isFinite( bytes ) ) {
          return '?';
        }

        var unit = 0;

        //TODO: Should be 1024, ask Andreas (for space ls)
        while ( bytes >= 1000 ) {
          bytes /= 1000;
          unit ++;
        }

        return bytes.toFixed( + precision ) + ' ' + units[ unit ];
      };
    })
  .filter('joinBy', function () {
        return function (input) {
          if(input.length === 0) {
            return '';
          }
          else {
            var stringOutput = ''; var j;
            for ( j = 0; j < input.length - 1; ++j) {
              stringOutput = stringOutput.concat(input[j].id + ', ');
            }
            stringOutput = stringOutput.concat(input[input.length - 1].id);
            return stringOutput;
          }
        };
    });
