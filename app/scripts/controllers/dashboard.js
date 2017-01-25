'use strict';
function dashboardCtrl($scope, $state, $filter, $http, $window, $interval, SweetAlert, eosService, COLORS) {


  $scope.switchQuota = function (value) {
    eosService.setSpaceQuota('default', $scope.checkState(value));
  };

  $scope.switchBalancer = function (value) {
    eosService.setSpaceConfig('default', 'space.balancer',$scope.checkState(value));
  };

  $scope.switchGeoBalancer = function (value) {
    eosService.setSpaceConfig('default', 'space.geobalancer',$scope.checkState(value));
  };

  $scope.switchGroupBalancer = function (value) {
    eosService.setSpaceConfig('default', 'space.groupbalancer',$scope.checkState(value));
  };

  $scope.switchConverter = function (value) {
    eosService.setSpaceConfig('default', 'space.converter',$scope.checkState(value));
  };

  $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

  $scope.checkValue = function (state) {
    if (state === 'on') {
      return true;
    }
    if (state === 'off') {
      return false;
    }
  };

  $scope.checkState = function (value) {
    if (value === true) {
      return 'on';
    }
    if (value === false) {
      return 'off';
    }
  };

  $scope.activeGroupsCount = function(groups) {
    var count = 0;
    angular.forEach(groups, function(group){
        count += group.cfg.status === 'on' ? 1 : 0;
    });
    return count; 
  };

  $scope.dataTableOpt = {
    'ajax': 'data/datatables-arrays.json'
  };

  $scope.updateClusterCount = function (locationInfo, clusterInfo) {
    var i; var j; var k;
    for ( i = 0; i < locationInfo.length; ++i) {
      locationInfo[i].clustersAttachedTo = [];
      for ( j = 0; j < clusterInfo.length; ++j) {
          var drivesAttached = clusterInfo[j].drives;
          for ( k = 0; k < drivesAttached.length; ++k) {
            if(drivesAttached[k].wwn === locationInfo[i].wwn) {
              locationInfo[i].clustersAttachedTo.push({'id':clusterInfo[j].clusterID});
            }
          }
      }
    }
    $scope.locationDefinition.location = locationInfo;
  };

  eosService.getGroups().success(function (response) {
      $scope.groups = response[0].group.ls;
      var nGroups = $scope.groups.length;
      var nActiveGroups = $scope.activeGroupsCount($scope.groups);
      // For the Tachometer
      $scope.percent1 = (nActiveGroups/nGroups)*100;  
    });

  eosService.getFileSystems().success(function (response) {
      $scope.fileSystems = response[0].fs.ls;
    });

  eosService.getNodes().success(function (response) {
      $scope.nodes = response[0].node.ls;
    });

  eosService.getVersion().success(function (response) {
      $scope.versionData = response[0].version[0].eos;
    });

  eosService.getClientInfo().success(function (response) {
      var whoResponse = response[0].who;
      $scope.clientInfo = whoResponse[whoResponse.length - 1];
    });

  // eosService.getNsStat().success(function (response) {
  //     $scope.nsStatData = response[0].ns.stat;
  //     $scope.avgExecLatency = parseFloat($scope.nsStatData[18].total.exec.avg);
  //     $scope.sigExecLatency = $scope.nsStatData[18].total.exec.sigma;
  //   });
  //
  eosService.whoami().success(function (response) {
	console.log(response[0].whoami[0].gid);
	console.log(response[0].whoami[0].uid);
        $scope.user = {
      	  fname: response[0].whoami[0].gid,
       	  lname: response[0].whoami[0].uid,
       	  jobDesc: 'IT-ST-AD',
       	  avatar: '../../images/avatar.jpg',
        };
   });
 
  function callAtInterval() {
    eosService.getNsStat().success(function (response) {
      $scope.nsStatData = response[0].ns.stat;
      $scope.avgExecLatency = parseFloat($scope.nsStatData[19].total.exec.avg);
      $scope.sigExecLatency = $scope.nsStatData[19].total.exec.sigma;
    });

    eosService.getSpaceStatus().success(function (response) {
      $scope.spaceStatus = response[0];
      $scope.balancer =  $scope.checkValue(response[0].space.status[0].balancer.status);
      $scope.converter =  $scope.checkValue(response[0].space.status[0].converter.status);
      $scope.geoBalancer =  $scope.checkValue(response[0].space.status[0].geobalancer.status);
      $scope.groupBalancer =  $scope.checkValue(response[0].space.status[0].groupbalancer.status);
      $scope.quota =  $scope.checkValue(response[0].space.status[0].quota);
    });

    eosService.getSpaces().success(function (response) {
      $scope.spaces = response[0].space.ls;
      $scope.readratemb = $scope.spaces[0].sum.stat.disk.readratemb;
      $scope.writeratemb = $scope.spaces[0].sum.stat.disk.writeratemb;
      $scope.inratemib = $scope.spaces[0].sum.stat.net.inratemib;
      $scope.outratemib = $scope.spaces[0].sum.stat.net.outratemib;
      $scope.ethratemib = $scope.spaces[0].sum.stat.net.ethratemib;
      // For the Tachometers
      $scope.percent2 = ($scope.spaces[0].sum.stat.statfs.usedbytes/$scope.spaces[0].sum.stat.statfs.capacity)*100;
      $scope.percent3 = ($scope.inratemib/$scope.ethratemib)*100;
      $scope.percent4 = ($scope.outratemib/$scope.ethratemib)*100;

    });
  }
  callAtInterval();
  $interval(callAtInterval, 100000);

  //Kinetic Cluster Info

  $scope.loadClusterInfo = function () {

    eosService.getClusterInfo('cluster',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.clusterDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
      $scope.configFormData = {'cacheCapacityMB':$scope.clusterDefinition.configuration.cacheCapacityMB,
                                'maxBackgroundIoThreads':$scope.clusterDefinition.configuration.maxBackgroundIoThreads,
                                'maxBackgroundIoQueue':$scope.clusterDefinition.configuration.maxBackgroundIoQueue,
                                'maxReadaheadWindow':$scope.clusterDefinition.configuration.maxReadaheadWindow
                              };

      $scope.extraClusterInfo = $scope.clusterDefinition;
      var i; var j;

      eosService.getFileSystems().success(function (response) {  //fetching again to ensure it is in the scope
        $scope.fileSystems = response[0].fs.ls;
        for ( i = 0; i < $scope.extraClusterInfo.cluster.length; ++i) {
          var clusterName = $scope.extraClusterInfo.cluster[i].clusterID;
          $scope.extraClusterInfo.cluster[i].failedDrives = 'Not Available';
          $scope.extraClusterInfo.cluster[i].indicator = 'Not Available';
          for ( j = 0; j < $scope.fileSystems.length; ++j) {
            if ($scope.fileSystems[j].path.indexOf(clusterName) !== -1) {
              $scope.extraClusterInfo.cluster[i].failedDrives = $scope.fileSystems[j].stat.health.drives_failed;
              $scope.extraClusterInfo.cluster[i].indicator = $scope.fileSystems[j].stat.health.indicator;
              break;
            }
          }
        }
      });
    });

    eosService.getClusterInfo('security',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.securityDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });

    eosService.getClusterInfo('location',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.locationDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });


  };

  //Set and get Space info for the session
  $scope.space = $window.localStorage.getItem('space');
  if(!$scope.space) {
    $scope.space = 'default';  //ToDO make it space with max clusters..
    $window.localStorage.setItem('space',  $scope.space);
  }
  $scope.loadClusterInfo();

  $scope.setSpaceName = function (spaceName) {
    $scope.space = spaceName;
    $window.localStorage.setItem('space', spaceName);
    $scope.loadClusterInfo();
  };

  $scope.submitConfig = function () {
    var clusterJSON = $scope.clusterDefinition;
    clusterJSON.configuration = $scope.configFormData;
    eosService.updateCluster('cluster', $scope.space, btoa(angular.toJson(clusterJSON, true))).success(function (response) {
      console.log(response[0].errormsg);
    });
    SweetAlert.swal('Updated!', 'Publish Changes!', 'success');
    $state.reload();
  };

  $scope.activateChangedConfig = function () { 
    eosService.updateConfig($scope.space);
    SweetAlert.swal('Published!', 'Now the changes will reflect.', 'success');
    $state.reload();
    $scope.updateClusterCount($scope.locationDefinition.location, $scope.clusterDefinition.cluster);
    eosService.updateCluster('location', $scope.space, btoa(angular.toJson($scope.locationDefinition, true))).success(function (response) {
      console.log(response[0].errormsg);
    });
    eosService.updateConfig($scope.space);
    $state.reload();
  };

  //Dashboard Tachnometer Options 
  $scope.options1 = {
    size: 180,
    lineWidth: 8,
    barColor: 'rgba(255,255,255,.7)',
    trackColor: 'rgba(0,0,0,.1)',
    lineCap: 'round',
    easing: 'easeOutBounce',
    onStep: function (from, to, percent) {
      angular.element(this.el).find('.percent').text(Math.round(percent));
    }
  };

  $scope.options2 = {
    size: 180,
    lineWidth: 8,
    barColor: 'rgba(255,255,255,.7)',
    trackColor: 'rgba(0,0,0,.1)',
    lineCap: 'butt',
    easing: 'easeOutBounce',
    onStep: function (from, to, percent) {
      angular.element(this.el).find('.percent').text(Math.round(percent));
    }
  };

  $scope.options3 = {
    size: 180,
    lineWidth: 8,
    barColor: 'rgba(255,255,255,.7)',
    // trackColor: false,
    trackColor: 'rgba(0,0,0,.1)',
    lineCap: 'round',
    easing: 'easeOutBounce',
    onStep: function (from, to, percent) {
      angular.element(this.el).find('.percent').text(Math.round(percent));
    }
  };

  $scope.options4 = {
    size: 180,
    lineWidth: 8,
    barColor: 'rgba(255,255,255,.7)',
    trackColor: 'rgba(0,0,0,.1)',
    lineCap: 'butt',
    easing: 'easeOutBounce',
    onStep: function (from, to, percent) {
      angular.element(this.el).find('.percent').text(Math.round(percent));
    }
  };

  angular.element('.piechart').each(function () {
    angular.element(this).css({
      'width': $scope.options1.size,
      'height': $scope.options1.size
    });
  });

  //Group
  $scope.delCluster = function (clusterID) {

    $scope.clusterToDel = clusterID;
    SweetAlert.swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this cluster!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: COLORS.danger,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function (isConfirm) {
        if (isConfirm) {
          var indexToDel = $scope.clusterDefinition.cluster.map(function(e) { return e.clusterID; }).indexOf(clusterID);
          if (indexToDel > -1) {
            $scope.clusterDefinition.cluster.splice(indexToDel, 1);
          }

          eosService.updateCluster('cluster', $scope.space, btoa(angular.toJson($scope.clusterDefinition, true))).success(function (response) {
            console.log(response[0].errormsg);
          });

          swal('Deleted!', 'This cluster has been deleted. Publish Changes!', 'success');
          $state.reload();
        }
      });
  };
  //Clusters
  $scope.delGroup = function (group) {

    SweetAlert.swal({
        title: 'Are you sure?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: COLORS.danger,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No!',
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function (isConfirm) {
        if (isConfirm) {
          eosService.removeGroup(group).success(function (response) {
            console.log(response[0].errormsg);
          });

          swal('Deleted!', 'The group has been deleted', 'success');
          $state.reload();
        }
      });
  };

  $scope.delDrive = function (wwn) {
    $scope.driveToDel = wwn;
    SweetAlert.swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this drive!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: COLORS.danger,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function (isConfirm) {
        if (isConfirm) {
          var indexToDel = $scope.locationDefinition.location.map(function(e) { return e.wwn; }).indexOf(wwn);
          if (indexToDel > -1 && isConfirm) {
            if ($scope.locationDefinition.location[indexToDel].clustersAttachedTo.length === 0){
              $scope.locationDefinition.location.splice(indexToDel, 1);
              eosService.updateCluster('location', $scope.space, btoa(angular.toJson($scope.locationDefinition, true))).success(function (response) {
                console.log(response[0].errormsg);
              });
              swal('Deleted!', 'This drive has been deleted. Publish Changes!', 'success');
              $state.reload();
            }
            else {
              swal('Can\'t Delete!', 'This drive is attached to a cluster', 'error');
            }
          }
        }
      });
    
  };
}

angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$state', '$filter', '$http', '$window', '$interval', 'SweetAlert', 'eosService', 'COLORS', dashboardCtrl])
  
angular.element('head').append('<link rel="stylesheet" href="vendor/jquery.tagsinput/src/jquery.tagsinput.css">');
