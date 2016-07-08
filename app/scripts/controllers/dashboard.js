'use strict';

// Fix converter and geo-tag balancer, balancer

function dashboardCtrl($scope, $interval, eosService, COLORS) {

  $scope.switchQuota = function (value) {
    eosService.setSpaceQuota('default', $scope.checkState(value));
  };
  $scope.switchBalancer = function (value) {
    eosService.setSpaceConfig('default', 'space.balancer',$scope.checkState(value));
    console.log('EOS', value);
  };
  //TODO: geotagbalancer doesn't take this command http://eosservicetest2:8000/proc/admin/?eos.rgid=0&eos.ruid=0&mgm.cmd=space&mgm.subcmd=config&callback=JSON_CALLBACK&mgm.space.name=default&mgm.space.key=space.geotagbalancer&mgm.space.value=on
  $scope.switchGeoTagBalancer = function (value) {
    eosService.setSpaceConfig('default', 'space.geotagbalancer',$scope.checkState(value));
  };
  $scope.switchGroupBalancer = function (value) {
    eosService.setSpaceConfig('default', 'space.groupbalancer',$scope.checkState(value));
  };
  $scope.switchConverter = function (value) {
    eosService.setSpaceConfig('default', 'space.converter',$scope.checkState(value));
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

  $scope.dataTableOpt = {
    'ajax': 'data/datatables-arrays.json'
  };

  eosService.getGroups().success(function (response) {
      $scope.groups = response[0].group.ls;
    });

  eosService.getFileSystems().success(function (response) {
      $scope.fileSystems = response[0].fs.ls;
    });

  eosService.getNodes().success(function (response) {
      $scope.nodes = response[0].node.ls;
    });

  eosService.getSpaces().success(function (response) {
      $scope.spaces = response[0].space.ls;
    });

  eosService.getVersion().success(function (response) {
      //Ask Andreas about Client verison and release
      $scope.versionData = response[0].version[0].eos;
    });

  eosService.getNsStat().success(function (response) {
      $scope.nsStatData = response[0].ns.stat;
    });

  eosService.getSpaceStatus().success(function (response) {
      $scope.spaceStatus = response[0];
      // TODO: Balncer status always off in API response even if it is on in CLI
      $scope.balancer =  $scope.checkValue(response[0].space.status[0].balancer.status);
      console.log($scope.balancer);
      // TODO: Get on/off status for converterin json
      $scope.converter =  $scope.checkValue(response[0].space.status[0].balancer.status);
      $scope.geoTagBalancer =  $scope.checkValue(response[0].space.status[0].geotagbalancer.status);
      $scope.groupBalancer =  $scope.checkValue(response[0].space.status[0].groupbalancer.status);
      $scope.quota =  $scope.checkValue(response[0].space.status[0].quota);
    });

}

angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$interval','eosService', 'COLORS', dashboardCtrl]);