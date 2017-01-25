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


  $scope.openNewGroupModal = function () {

    $scope.formData = {'name': '',
                          'state':'off'
                        };

    var modalInstance = $modal.open({
      templateUrl: 'groupAddModal.html',
      controller: 'ModalInstanceCtrl',
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
    SweetAlert.swal('Updated!', 'Publish Changes!', 'success');
    $state.reload();
    $modalInstance.dismiss('cancel');
  };

  $scope.addNewGroup = function () {

    eosService.setGroup(updatedItem.name, updatedItem.state).success(function (response) {
      console.log(response[0].errormsg);
    });

    SweetAlert.swal('Added!','The group has been added!', 'success');
    $state.reload();
    $modalInstance.dismiss('cancel');
  }

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
  .controller('ModalDemoCtrl', ['$scope', '$state', '$modal', '$log', 'eosService', ModalDemoCtrl])
    .controller('ModalInstanceCtrl', ['$scope', '$state', '$modalInstance', 'updatedItem', 'originalItem', 'space', 'SweetAlert', 'eosService', ModalInstanceCtrl]);
