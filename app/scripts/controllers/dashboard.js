'use strict';
function dashboardCtrl($scope, $state, $filter, $http, eosService, COLORS) {


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

  $scope.space = 'default';  //ToDO make it space with max clusters..
  $scope.loadClusterInfo();
  console.log($scope.space);

  $scope.setSpaceName = function (spaceName) {

    $scope.space = spaceName;
    $scope.loadClusterInfo();
    // $scope.$digest();
    console.log($scope.space);
    // $state.reload();

  };

  $scope.submitConfig = function () {
    var clusterJSON = $scope.clusterDefinition;
    clusterJSON.configuration = $scope.configFormData;
    $scope.updateClusterDefinition(clusterJSON);
  };

  $scope.updateClusterDefinition = function (updatedClusterDefinition) {
    eosService.updateCluster('cluster', $scope.space, btoa(JSON.stringify(updatedClusterDefinition))).success(function (response) {
      console.log(response[0].errormsg);
    });
    $state.reload();
  };
  $scope.updateLocationDefinition = function (updatedLocationDefinition) {
    eosService.updateCluster('location', $scope.space,btoa(JSON.stringify(updatedLocationDefinition))).success(function (response) {
      console.log(response[0].errormsg);
    });
    $state.reload();

  };
  $scope.updateSecurityDefinition = function (updatedSecurityDefinition) {
    eosService.updateCluster('security', $scope.space, btoa(JSON.stringify(updatedSecurityDefinition))).success(function (response) {
      console.log(response[0].errormsg);
    });
    $state.reload();
  };

  $scope.activateChangedConfig = function () { 
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
  $scope.validationOpt = {
    rules: {
      emailfield: {
        required: true,
        email: true,
        minlength: 3
      },
      namefield: {
        required: true,
        minlength: 3
      }
    }
  };

  $scope.wizardOpt = {
    tabClass: '',
    'nextSelector': '.button-next',
    'previousSelector': '.button-previous',
    'firstSelector': '.button-first',
    'lastSelector': '.button-last',
    onNext: function () {
      var $valid = angular.element('#commentForm').valid(),
        $validator;
      if (!$valid) {
        $validator.focusInvalid();
        return false;
      }
    },
    onTabClick: function () {
      return false;
    }
  };

}

function ModalDemoCtrl($scope, $modal, $log, eosService) {


  $scope.openDriveUpdateModal = function (size, driveName) {

    eosService.getClusterInfo('location',$scope.space).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.locationDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
    });

    $scope.modalInfo = $scope.locationDefinition.location.filter(function(item) { return item.wwn === driveName; });
    $scope.formData = {'inet4': [$scope.modalInfo[0].inet4[0], $scope.modalInfo[0].inet4[1]],
                         'wwn': $scope.modalInfo[0].wwn,
                         'port': $scope.modalInfo[0].port 
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
                          'drives': $scope.modalInfo[0].drives
                        };

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
function ModalInstanceCtrl($scope, $state, $modalInstance, updatedItem, originalItem, space, eosService) {
  $scope.formData = updatedItem;
  $scope.space = space;

  $scope.submitDriveUpdate = function () {
    var driveJSON = originalItem;
    var index = driveJSON.location.map(function(e) { return e.wwn; }).indexOf(updatedItem.wwn);
    updatedItem.port = parseInt(updatedItem.port);

    $scope.formData = driveJSON.location[index];

    driveJSON.location[index] = updatedItem;
    driveJSON = btoa(JSON.stringify(driveJSON));

    eosService.updateCluster('location', $scope.space, driveJSON).success(function (response) {
      console.log(response[0].errormsg);
    });
    $state.reload();
  };

  $scope.submitClusterUpdate = function () {
    var clusterJSON = originalItem;
    var index = clusterJSON.cluster.map(function(e) { return e.clusterID; }).indexOf(updatedItem.clusterID);
    updatedItem.timeout = parseInt(updatedItem.timeout);
    updatedItem.minReconnectInterval = parseInt(updatedItem.minReconnectInterval);

    $scope.formData = clusterJSON.cluster[index];

    clusterJSON.cluster[index] = updatedItem;
    clusterJSON = btoa(JSON.stringify(clusterJSON));

    eosService.updateCluster('cluster', $scope.space, clusterJSON).success(function (response) {
      console.log(response[0].errormsg);
    });
    $state.reload();
  };

  $scope.activateChangedConfig = function () {
    eosService.updateConfig($scope.space);
    $state.reload();
    // $modalInstance.dismiss('cancel');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$state', '$filter', '$http', 'eosService', 'COLORS', dashboardCtrl])
  .controller('ModalDemoCtrl', ['$scope', '$modal', '$log', 'eosService', ModalDemoCtrl])
  .controller('ModalInstanceCtrl', ['$scope', '$state', '$modalInstance', 'updatedItem', 'originalItem', 'space', 'eosService', ModalInstanceCtrl]);
