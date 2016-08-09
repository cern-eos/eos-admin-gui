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

  function callAtInterval() {
    eosService.getNsStat().success(function (response) {
      $scope.nsStatData = response[0].ns.stat;
      $scope.avgExecLatency = parseFloat($scope.nsStatData[18].total.exec.avg);
      $scope.sigExecLatency = $scope.nsStatData[18].total.exec.sigma;
    });

    eosService.getSpaceStatus().success(function (response) {
      $scope.spaceStatus = response[0];
      $scope.balancer =  $scope.checkValue(response[0].space.status[0].balancer.status);
      $scope.converter =  $scope.checkValue(response[0].space.status[0].converter.status);
      $scope.geoBalancer =  $scope.checkValue(response[0].space.status[0].geotagbalancer.status);
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
      $scope.percent3 = ($scope.outratemib/$scope.ethratemib)*100;

    });
  }

  $interval(callAtInterval, 1000);

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
  if($scope.space === '') {
    $scope.space = 'default';  //ToDO make it space with max clusters..
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

  //Clusters

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
        var indexToDel = $scope.clusterDefinition.cluster.map(function(e) { return e.clusterID; }).indexOf(clusterID);
        if (indexToDel > -1) {
          $scope.clusterDefinition.cluster.splice(indexToDel, 1);
        }

        eosService.updateCluster('cluster', $scope.space, btoa(angular.toJson($scope.clusterDefinition, true))).success(function (response) {
          console.log(response[0].errormsg);
        });

        swal('Deleted!', 'This cluster has been deleted. Publish Changes!', 'success');
        $state.reload();
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
      });
    
  };
}

function ModalDemoCtrl($scope, $state, $modal, $log, eosService) {
  
  $scope.openSetSecurityModal = function (size) {

    $scope.formData = {'securityKey': null};

    var modalInstance = $modal.open({
      templateUrl: 'setSecurity.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        updatedItem: function () {
          return $scope.formData;
        },
        originalItem: function () {
          return null;
        },
        space: function () {
          return $scope.space;
        }
      }
    });
  };

  $scope.openDriveUpdateModal = function (size, driveName) {

    eosService.getClusterInfo('location',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.locationDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });

    $scope.modalInfo = $scope.locationDefinition.location.filter(function(item) { return item.wwn === driveName; });
    $scope.formData = {'inet4': [$scope.modalInfo[0].inet4[0], $scope.modalInfo[0].inet4[1]],
                         'wwn': $scope.modalInfo[0].wwn,
                         'port': $scope.modalInfo[0].port, 
                         'clustersAttachedTo': $scope.modalInfo[0].clustersAttachedTo,
                         'securityKey': ''
                        };

    var modalInstance = $modal.open({
      templateUrl: 'driveUpdateModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        updatedItem: function () {
          return $scope.formData;
        },
        originalItem: function () {
          return $scope.locationDefinition;
        },
        space: function () {
          return $scope.space;
        }
      }
    });
  };

  $scope.openNewClusterModal = function (size) {

    eosService.getClusterInfo('cluster',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.clusterDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });

    $scope.formData = {'clusterID': '',
                          'numData': '',
                          'numParity': '',
                          'chunkSizeKB': '',
                          'minReconnectInterval': '',
                          'timeout': '',
                          'drives': [],
                          'automaticSelection': false,
                          'numDrives': '',
                          'sharing': false,
                          'numShare':''
                        };

    var modalInstance = $modal.open({
      templateUrl: 'newClusterModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        updatedItem: function () {
          return $scope.formData;
        },
        originalItem: function () {
          return $scope.clusterDefinition;
        },
        space: function () {
          return $scope.space;
        }
      }
    });
  };

  $scope.openNewDriveModal = function (size) {

    $scope.formData = {'eth0': '',
                         'eth1': '',
                         'wwn': '',
                         'port': '', 
                         'securityKey': '',
                         'userID': ''
                        };

    var modalInstance = $modal.open({
      templateUrl: 'newDriveModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        updatedItem: function () {
          return $scope.formData;
        },
        originalItem: function () {
          return null;
        },
        space: function () {
          return $scope.space;
        }
      }
    });
  };


  $scope.openClusterUpdateModal = function (size, clusterID) {

    eosService.getClusterInfo('cluster',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.clusterDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });

    $scope.modalInfo = $scope.clusterDefinition.cluster.filter(function(item) { return item.clusterID === clusterID; });

    $scope.formData = {'clusterID': $scope.modalInfo[0].clusterID,
                          'numData': $scope.modalInfo[0].numData,
                          'numParity': $scope.modalInfo[0].numParity,
                          'chunkSizeKB': $scope.modalInfo[0].chunkSizeKB,
                          'minReconnectInterval': $scope.modalInfo[0].minReconnectInterval,
                          'timeout': $scope.modalInfo[0].timeout,
                          'drives': ''
                        };

    var i;
    for ( i = 0; i < $scope.modalInfo[0].drives.length; ++i) {
        $scope.formData.drives = $scope.formData.drives + $scope.modalInfo[0].drives[i].wwn + ' ';
    }
    
    var modalInstance = $modal.open({
      templateUrl: 'clusterUpdateModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        updatedItem: function () {
          return $scope.formData;
        },
        originalItem: function () {
          return $scope.clusterDefinition;
        },
        space: function () {
          return $scope.space;
        }
      }
    });
  };

}

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
function ModalInstanceCtrl($scope, $state, $modalInstance, updatedItem, originalItem, space, SweetAlert, eosService) {
  $scope.formData = updatedItem;
  $scope.space = space;
  eosService.getClusterInfo('location',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.locationDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });

  $scope.setSecurity = function () {
    var securityJSON = JSON.parse(updatedItem.securityJSON);
    securityJSON = btoa(angular.toJson(securityJSON, true));
    eosService.updateCluster('security', $scope.space, securityJSON).success(function (response) {
      console.log(response[0].errormsg);
    });
    SweetAlert.swal('Updated!', 'Publish Changes!', 'success');
    $state.reload();
    $modalInstance.dismiss('cancel');
  };

  $scope.submitDriveUpdate = function () {
    var driveJSON = originalItem;
    var index = driveJSON.location.map(function(e) { return e.wwn; }).indexOf(updatedItem.wwn);
    updatedItem.port = parseInt(updatedItem.port);
    var newKey = updatedItem.securityKey;

    if(newKey !== ''){
      eosService.getClusterInfo('security',$scope.space).success(function (response) {
        var value = response[0].space['node-get'][0]['*:'];
        $scope.securityDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
        var indexSecurity = $scope.securityDefinition.security.map(function(e) { return e.wwn; }).indexOf(updatedItem.wwn);
        $scope.securityDefinition.security[indexSecurity].key = newKey;
        eosService.updateCluster('security', $scope.space, btoa(angular.toJson($scope.securityDefinition, true))).success(function (response) {
          console.log(response[0].errormsg);
        });
        // eosService.updateConfig($scope.space);  //Relying on user to activate
      });
    }

    $scope.formData = driveJSON.location[index];  //formData set to original
    delete updatedItem.securityKey;   //securityKey removed from this json
    driveJSON.location[index] = updatedItem;
    driveJSON = btoa(angular.toJson(driveJSON, true));
    eosService.updateCluster('location', $scope.space, driveJSON).success(function (response) {
      console.log(response[0].errormsg);
    });
    SweetAlert.swal('Updated!', 'Publish Changes!', 'success');
    $state.reload();
    $modalInstance.dismiss('cancel');
  };

  $scope.submitClusterUpdate = function () {
    var clusterJSON = originalItem;
    var index = clusterJSON.cluster.map(function(e) { return e.clusterID; }).indexOf(updatedItem.clusterID);
    updatedItem.timeout = parseInt(updatedItem.timeout);
    updatedItem.minReconnectInterval = parseInt(updatedItem.minReconnectInterval);

    $scope.formData = clusterJSON.cluster[index];

    clusterJSON.cluster[index] = updatedItem;
    clusterJSON = btoa(angular.toJson(clusterJSON, true));

    eosService.updateCluster('cluster', $scope.space, clusterJSON).success(function (response) {
      console.log(response[0].errormsg);
    });
    $state.reload();
  };

  $scope.addNewCluster = function () {
    var newClusterJSON = {};
    newClusterJSON.clusterID = updatedItem.clusterID;
    newClusterJSON.numData = parseInt(updatedItem.numData);
    newClusterJSON.numParity = parseInt(updatedItem.numParity);
    newClusterJSON.chunkSizeKB = parseInt(updatedItem.chunkSizeKB);
    newClusterJSON.minReconnectInterval = parseInt(updatedItem.minReconnectInterval);
    newClusterJSON.timeout = parseInt(updatedItem.timeout);
    newClusterJSON.drives = [];
    var i; var drivesAvailable;
    var drives = $scope.locationDefinition.location;

    if (updatedItem.automaticSelection === true) {
      if (updatedItem.sharing === false) {
        drivesAvailable = drives.filter(function(item) { return item.clustersAttachedTo.length === 0; });
      }
      else {
        if (updatedItem.numShare > 0) {
          drivesAvailable = drives.filter(function(item) { return item.clustersAttachedTo.length < updatedItem.numShare; });  
        }
        else {
          drivesAvailable = [];
        } 
      }
      if(drivesAvailable.length >= updatedItem.numDrives) {
        var index ;
        for ( i = 0; i < updatedItem.numDrives; ++i) {
          index = Math.floor(Math.random() * (drivesAvailable.length));
          newClusterJSON.drives.push({'wwn': drivesAvailable[index].wwn});
          drivesAvailable.splice(index, 1);
        }
      }
    }

    else {
      for ( i = 0; i < updatedItem.drives.length; ++i) {
        newClusterJSON.drives.push({'wwn': updatedItem.drives[i]});
      }
    }

    
    originalItem.cluster.push(newClusterJSON);
    originalItem = btoa(angular.toJson(originalItem, true));

    eosService.updateCluster('cluster', $scope.space, originalItem).success(function (response) {
      console.log(response[0].errormsg);
    });

    SweetAlert.swal('Added!', 'Publish Changes!', 'success');
    $state.reload();
    $modalInstance.dismiss('cancel');
  };

  $scope.addNewDrive = function () {
    var newDriveJSON = {};
    newDriveJSON.wwn = updatedItem.wwn;
    newDriveJSON.inet4 = [];
    newDriveJSON.inet4.push(updatedItem.eth0);
    newDriveJSON.inet4.push(updatedItem.eth1);
    newDriveJSON.port = parseInt(updatedItem.port);
    newDriveJSON.clustersAttachedTo = [];

    var newKey = updatedItem.securityKey;
    if(newKey !== ''){
      eosService.getClusterInfo('security',$scope.space).success(function (response) {
        var value = response[0].space['node-get'][0]['*:'];
        $scope.securityDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
        var securityJSON = {};
        securityJSON.wwn = updatedItem.wwn;
        securityJSON.userId = parseInt(updatedItem.userID);
        securityJSON.key = newKey;
        $scope.securityDefinition.security.push(securityJSON);
        eosService.updateCluster('security', $scope.space, btoa(angular.toJson($scope.securityDefinition, true))).success(function (response) {
          console.log(response[0].errormsg);
        });
      });
      // eosService.updateConfig($scope.space);  //Relying on user for activation
    }

    $scope.locationDefinition.location.push(newDriveJSON);
    var driveJSON = btoa(angular.toJson($scope.locationDefinition, true));
    // console.log(newDriveJSON);
    // console.log($scope.locationDefinition);
    eosService.updateCluster('location', $scope.space, driveJSON).success(function (response) {
      console.log(response[0].errormsg);
    });
    SweetAlert.swal('Added!', 'Publish Changes!', 'success');
    $state.reload();
    $modalInstance.dismiss('cancel');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$state', '$filter', '$http', '$window', '$interval', 'SweetAlert', 'eosService', 'COLORS', dashboardCtrl])
  .controller('ModalDemoCtrl', ['$scope', '$state', '$modal', '$log', 'eosService', ModalDemoCtrl])
  .controller('ModalInstanceCtrl', ['$scope', '$state', '$modalInstance', 'updatedItem', 'originalItem', 'space', 'SweetAlert', 'eosService', ModalInstanceCtrl]);
  
angular.element('head').append('<link rel="stylesheet" href="vendor/jquery.tagsinput/src/jquery.tagsinput.css">');
