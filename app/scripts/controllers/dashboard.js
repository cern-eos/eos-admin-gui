'use strict';

function dashboardCtrl($scope, $interval, eosService, COLORS) {

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
      $scope.percent3 = ($scope.outratemib/$scope.ethratemib)*100;

    });

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


}

angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$interval','eosService', 'COLORS', dashboardCtrl]);