'use strict';
function dashboardCtrl($scope, $filter, $http, $interval, editableOptions, editableThemes, eosService, COLORS) {

  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';

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

  $scope.loadClusterDefiniton = function (spaceName) {
    eosService.getClusterInfo('cluster',spaceName).success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.clusterDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
      console.log($scope.clusterDefinition);
    });
  };

  eosService.getClusterInfo('security','default').success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.securityDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
      // console.log($scope.securityDefinition);
    });

 

  eosService.getClusterInfo('location','default').success(function (response) {
      var value = response[0].space['node-get'][0]['*:'];
      $scope.locationDefinition = JSON.parse(atob(value.substring(value.indexOf(':') + 1)));
      // console.log($scope.locationDefinition);
    });


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
      },
      passwordfield: {
        required: true,
        minlength: 6
      },
      cpasswordfield: {
        required: true,
        minlength: 6,
        equalTo: '#passwordfield'
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

  $scope.users = [
    {
      id: 1,
      name: 'awesome user1',
      status: 2,
      group: 4,
      groupName: 'admin'
        },
    {
      id: 2,
      name: 'awesome user2',
      status: undefined,
      group: 3,
      groupName: 'vip'
        },
    {
      id: 3,
      name: 'awesome user3',
      status: 2,
      group: null
        }
  ];

  $scope.statuses = [
    {
      value: 1,
      text: 'status1'
        },
    {
      value: 2,
      text: 'status2'
        },
    {
      value: 3,
      text: 'status3'
        },
    {
      value: 4,
      text: 'status4'
        }
  ];

  $scope.groups = [];
  $scope.loadGroups = function () {
    return $scope.groups.length ? null : $http.get('data/groups.json').success(function (data) {
      $scope.groups = data;
    });
  };

  $scope.showGroup = function (user) {
    if (user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {
        id: user.group
      });
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function (user) {
    var selected = [];
    if (user.status) {
      selected = $filter('filter')($scope.statuses, {
        value: user.status
      });
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function (data, id) {
    if (id === 2 && data !== 'awesome') {
      return 'Username 2 should be `awesome`';
    }
  };

  $scope.saveUser = function (data, id) {
    //$scope.user not updated yet
    angular.extend(data, {
      id: id
    });
    //return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeUser = function (index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function () {
    $scope.inserted = {
      id: $scope.users.length + 1,
      name: '',
      status: null,
      group: null
    };
    $scope.users.push($scope.inserted);
  };

  $scope.checkName2 = function (data) {
    if (data !== 'awesome') {
      return 'Username should be `awesome`';
    }
  };

  $scope.saveColumn = function (column) {
    var results = [];
    /*angular.forEach($scope.users, function(user) {
      results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
    })
    return $q.all(results);*/
  };

  $scope.checkName3 = function (data, id) {
    if (id === 2 && data !== 'awesome') {
      return 'Username 2 should be `awesome`';
    }
  };

  // filter users to show
  $scope.filterUser = function (user) {
    return user.isDeleted !== true;
  };

  // mark user as deleted
  $scope.deleteUser = function (id) {
    var filtered = $filter('filter')($scope.users, {
      id: id
    });
    if (filtered.length) {
      filtered[0].isDeleted = true;
    }
  };

  // add user
  $scope.addUser2 = function () {
    $scope.users.push({
      id: $scope.users.length + 1,
      name: '',
      status: null,
      group: null,
      isNew: true
    });
  };

  // cancel all changes
  $scope.cancel = function () {
    for (var i = $scope.users.length; i--;) {
      var user = $scope.users[i];
      // undelete
      if (user.isDeleted) {
        delete user.isDeleted;
      }
      // remove new
      if (user.isNew) {
        $scope.users.splice(i, 1);
      }
    }
  };

  // save edits
  $scope.saveTable = function () {
    var results = [];
    for (var i = $scope.users.length; i--;) {
      var user = $scope.users[i];
      // actually delete user
      if (user.isDeleted) {
        $scope.users.splice(i, 1);
      }
      // mark as not new
      if (user.isNew) {
        user.isNew = false;
      }

      // send on server
      //results.push($http.post('/saveUser', user));
    }

    return; // $q.all(results);
  };

}


angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$filter', '$http', '$interval', 'editableOptions', 'editableThemes', 'eosService', 'COLORS', dashboardCtrl]);
