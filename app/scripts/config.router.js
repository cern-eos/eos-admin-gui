'use strict';

angular
  .module('urbanApp')
  .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$on('$stateChangeSuccess', function () {
        window.scrollTo(0, 0);
      });
      FastClick.attach(document.body);
        },
    ])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      // For unmatched routes
      $urlRouterProvider.otherwise('/');

      // Application routes
      $stateProvider
        .state('app', {
          abstract: true,
          templateUrl: 'views/common/layout.html',
        })


      .state('app.dashboard', {
        url: '/',
        templateUrl: 'views/dashboard.html',
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                insertBefore: '#load_styles_before',
                files: [
                                'styles/climacons-font.css',
                                'vendor/rickshaw/rickshaw.min.css',
                                'vendor/chosen_v1.4.0/chosen.min.css',
                                'vendor/datatables/media/css/jquery.dataTables.css'
                            ]
                        },
              {
                serie: true,
                files: [
                                'vendor/d3/d3.min.js',
                                'vendor/rickshaw/rickshaw.min.js',
                                'vendor/flot/jquery.flot.js',
                                'vendor/flot/jquery.flot.resize.js',
                                'vendor/flot/jquery.flot.pie.js',
                                'vendor/flot/jquery.flot.categories.js',
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'scripts/extentions/bootstrap-datatables.js',
                                'vendor/jquery.easy-pie-chart/dist/angular.easypiechart.js',
                            ]
                        },
              {
                  name: 'angular-flot',
                  files: [
                                'vendor/angular-flot/angular-flot.js'
                            ]
                        }]).then(function () {
                return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                  return $ocLazyLoad.load('scripts/services/eosService.js');
                });

            });
                    }]
        },
        data: {
          title: 'Dashboard',
        }
      })

      .state('app.views', {
          template: '<div ui-view></div>',
          abstract: true,
          url: '/views',
        })
        .state('app.views.fileSystemView', {
            url: '/fileSystems',
            templateUrl: 'views/fileSystems.html',
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                  {
                    insertBefore: '#load_styles_before',
                    files: [
                                  'vendor/chosen_v1.4.0/chosen.min.css',
                                  'vendor/datatables/media/css/jquery.dataTables.css'
                              ]
                          },
                  {
                    serie: true,
                    files: [
                                  'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                  'vendor/datatables/media/js/jquery.dataTables.js',
                                  'vendor/angularutils-pagination/dirPagination.js',
                                  'scripts/extentions/bootstrap-datatables.js'
                              ]
                          }]).then(function () {

                  return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                      return $ocLazyLoad.load('scripts/services/eosService.js');
                  });
                });
                      }]
            },
            data: {
              title: 'File System View',
            }
          })

        .state('app.views.groupView', {
          url: '/groups',
          templateUrl: 'views/groups.html',
          resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  insertBefore: '#load_styles_before',
                  files: [
                                'vendor/chosen_v1.4.0/chosen.min.css',
                                'vendor/datatables/media/css/jquery.dataTables.css'
                            ]
                        },
                {
                  serie: true,
                  files: [
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'vendor/angularutils-pagination/dirPagination.js',
                                'scripts/extentions/bootstrap-datatables.js'
                            ]
                        }]).then(function () {
                return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                    return $ocLazyLoad.load('scripts/services/eosService.js');
                });
              });
                    }]
          },
          data: {
            title: 'Group View',
          }
        })

        .state('app.views.spaceView', {
          url: '/spaces',
          templateUrl: 'views/spaces.html',
          resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  insertBefore: '#load_styles_before',
                  files: [
                                'vendor/chosen_v1.4.0/chosen.min.css',
                                'vendor/datatables/media/css/jquery.dataTables.css'
                            ]
                        },
                {
                  serie: true,
                  files: [
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'vendor/angularutils-pagination/dirPagination.js',
                                'scripts/extentions/bootstrap-datatables.js'
                            ]
                        }]).then(function () {
                return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                    return $ocLazyLoad.load('scripts/services/eosService.js');
                });
              });
                    }]
          },
          data: {
            title: 'Space View',
          }
        })

        .state('app.views.nodeView', {
          url: '/nodes',
          templateUrl: 'views/nodes.html',
          resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  insertBefore: '#load_styles_before',
                  files: [
                                'vendor/chosen_v1.4.0/chosen.min.css',
                                'vendor/datatables/media/css/jquery.dataTables.css'
                            ]
                        },
                {
                  serie: true,
                  files: [
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'vendor/angularutils-pagination/dirPagination.js',
                                'scripts/extentions/bootstrap-datatables.js'
                            ]
                        }]).then(function () {
                return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                    return $ocLazyLoad.load('scripts/services/eosService.js');
                });
              });
                    }]
          },
          data: {
            title: 'Node View',
          }
        })
      
      .state('app.kineticClusters', {
          template: '<div ui-view></div>',
          abstract: true,
          url: '/kineticClusters',
        })
        .state('app.kineticClusters.clusters', {
            url: '/clusters',
            templateUrl: 'views/clusters.html',
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                  {
                    insertBefore: '#load_styles_before',
                    files: [
                                  'vendor/checkbo/src/0.1.4/css/checkBo.min.css',
                                  'vendor/chosen_v1.4.0/chosen.min.css',
                                  'vendor/jquery.tagsinput/src/jquery.tagsinput.css',
                                  'vendor/datatables/media/css/jquery.dataTables.css'
                              ]
                          },
                  {


                //             'vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css',
                //                 'vendor/chosen_v1.4.0/chosen.min.css',
                //                 'vendor/jquery.tagsinput/src/jquery.tagsinput.css',
                //                 'vendor/checkbo/src/0.1.4/css/checkBo.min.css',
                //                 'vendor/intl-tel-input/build/css/intlTelInput.css',
                //                 'vendor/bootstrap-daterangepicker/daterangepicker-bs3.css',
                //                 'vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
                //                 'vendor/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                //                 'vendor/clockpicker/dist/bootstrap-clockpicker.min.css',
                //                 'vendor/mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css'
                //             ]
                //         },
                // {
                //   serie: true,
                //   files: [
                //                 'vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                //                 'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                //                 'vendor/jquery.tagsinput/src/jquery.tagsinput.js',
                //                 'vendor/checkbo/src/0.1.4/js/checkBo.min.js',
                //                 'vendor/intl-tel-input//build/js/intlTelInput.min.js',
                //                 'vendor/moment/min/moment.min.js',
                //                 'vendor/bootstrap-daterangepicker/daterangepicker.js',
                //                 'vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
                //                 'vendor/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                //                 'vendor/clockpicker/dist/jquery-clockpicker.min.js',
                //                 'vendor/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js'



                    serie: true,
                    files: [
                                'vendor/checkbo/src/0.1.4/js/checkBo.min.js',
                                'vendor/card/lib/js/jquery.card.js',
                                'vendor/bootstrap/js/tab.js',
                                'vendor/jquery-validation/dist/jquery.validate.min.js',
                                'vendor/jquery.tagsinput/src/jquery.tagsinput.js',
                                'vendor/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'vendor/angularutils-pagination/dirPagination.js',
                                'scripts/extentions/bootstrap-datatables.js'
                              ]
                          }]).then(function () {
                  return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                        return $ocLazyLoad.load('scripts/services/eosService.js');
                    });
                  });
                      }]
            },
            data: {
              title: 'Clusters',
            }
          })
        .state('app.kineticClusters.locations', {
            url: '/locations',
            templateUrl: 'views/locations.html',
            resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  insertBefore: '#load_styles_before',
                  files: [
                                'vendor/chosen_v1.4.0/chosen.min.css',
                                'vendor/checkbo/src/0.1.4/css/checkBo.min.css',
                                'vendor/datatables/media/css/jquery.dataTables.css',
                                'vendor/sweetalert/dist/sweetalert.css'
                            ]
                        },
                {
                  serie: true,
                  name: 'oitozero.ngSweetAlert',
                  files: [      
                                'vendor/checkbo/src/0.1.4/js/checkBo.min.js',
                                'vendor/card/lib/js/jquery.card.js',
                                'vendor/bootstrap/js/tab.js',
                                'vendor/jquery-validation/dist/jquery.validate.min.js',
                                'vendor/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'vendor/angularutils-pagination/dirPagination.js',
                                'scripts/extentions/bootstrap-datatables.js',
                                'vendor/sweetalert/dist/sweetalert.min.js',
                                'vendor/angular-sweetalert/SweetAlert.min.js'
                            ]
                        }]).then(function () {
                return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                    return $ocLazyLoad.load('scripts/services/eosService.js');
                    });
                });
              }]
            },
              data: {
                title: 'Cluster Locations',
              }
          })
        .state('app.kineticClusters.security', {
            url: '/security',
            templateUrl: 'views/security.html',
            resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  insertBefore: '#load_styles_before',
                  files: [
                                'vendor/chosen_v1.4.0/chosen.min.css',
                                'vendor/checkbo/src/0.1.4/css/checkBo.min.css',
                                'vendor/datatables/media/css/jquery.dataTables.css',
                                'vendor/sweetalert/dist/sweetalert.css'
                            ]
                        },
                {
                  serie: true,
                  name: 'oitozero.ngSweetAlert',
                  files: [      
                                'vendor/checkbo/src/0.1.4/js/checkBo.min.js',
                                'vendor/card/lib/js/jquery.card.js',
                                'vendor/bootstrap/js/tab.js',
                                'vendor/jquery-validation/dist/jquery.validate.min.js',
                                'vendor/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                'vendor/datatables/media/js/jquery.dataTables.js',
                                'vendor/angularutils-pagination/dirPagination.js',
                                'scripts/extentions/bootstrap-datatables.js',
                                'vendor/sweetalert/dist/sweetalert.min.js',
                                'vendor/angular-sweetalert/SweetAlert.min.js'
                            ]
                        }]).then(function () {
                return $ocLazyLoad.load('scripts/controllers/dashboard.js').then(function () {
                    return $ocLazyLoad.load('scripts/services/eosService.js');
                    });
                });
              }]
            },
            data: {
              title: 'Cluster Security',
            }
          })
      

      .state('app.404', {
          url: '/404',
          templateUrl: 'views/extras-404.html',
          data: {
            title: 'Page Not Found',
            contentClasses: 'no-padding',
          }
        })
        .state('user.500', {
          url: '/500',
          templateUrl: 'views/extras-500.html',
          data: {
            appClasses: 'usersession',
            contentClasses: 'full-height'
          }
        })
        .state('user.lockscreen', {
          url: '/lockscreen',
          templateUrl: 'views/extras-lockscreen.html',
          resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load('scripts/controllers/session.js');
                    }]
          },
          data: {
            appClasses: 'usersession',
            contentClasses: 'full-height'
          }
        });
        }
    ])
  .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
      debug: false,
      events: false
    });
    }]);
