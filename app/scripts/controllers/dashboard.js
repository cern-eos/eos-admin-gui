'use strict';

function dashboardCtrl($scope, $interval, eosService, COLORS) {

  var visits = [
        [0, 8],
        [1, 1],
        [2, 1],
        [3, 6],
        [4, 4],
        [5, 3],
        [6, 9],
        [7, 7],
        [8, 1]
        ];

  $scope.lineDataset = [{
      data: visits,
      color: COLORS.success
    }];

  $scope.lineOptions = {
    series: {
      lines: {
        show: true,
        lineWidth: 1,
        fill: true
      },
      shadowSize: 0
    },
    grid: {
      color: COLORS.border,
      borderWidth: 0,
      hoverable: true,
    },
    xaxis: {
      min: 0,
      max: 8
    },
    yaxis: {
      min: 0,
      max: 10
    }
  };

  $scope.pieDataset = [
    {
      label: 'IE',
      data: 15,
      color: COLORS.danger
        },
    {
      label: 'Safari',
      data: 14,
      color: COLORS.info
        },
    {
      label: 'Chrome',
      data: 34,
      color: COLORS.warning
        },
    {
      label: 'Opera',
      data: 13,
      color: COLORS.success
        },
    {
      label: 'Firefox',
      data: 24,
      color: COLORS.dark
        }
    ];

  $scope.pieOptions = {
    series: {
      pie: {
        show: true,
        innerRadius: 0.5,
        stroke: {
          width: 2
        },
        label: {
          show: true,
        }
      }
    },
    legend: {
      show: true
    },
  };

  $scope.barDataset = [
    {
      data: [['M', 80], ['T', 40], ['W', 20], ['Th', 20], ['F', 50]],
      bars: {
        show: true,
        barWidth: 0.6,
        align: 'center',
        fill: true,
        lineWidth: 0,
        fillColor: COLORS.default
      }
        }
    ];

  $scope.barOptions = {
    grid: {
      hoverable: false,
      clickable: false,
      color: 'white',
      borderWidth: 0,
    },
    yaxis: {
      show: false
    },
    xaxis: {
      mode: 'categories',
      tickLength: 0,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 12,
      axisLabelFontFamily: 'Roboto',
      axisLabelPadding: 5
    }
  };

  var seriesData = [[], [], []];
  var random = new Rickshaw.Fixtures.RandomData(150);

  for (var i = 0; i < 150; i++) {
    random.addData(seriesData);
  }

  $scope.options2 = {
    renderer: 'area',
    height: 250,
    padding: {
      top: 2, left: 0, right: 0, bottom: 0
    },
    interpolation: 'cardinal'
  };

  $scope.series = [{
    color: COLORS.primary,
    data: seriesData[0],
    name: 'Upload'
    }, {
    color: COLORS.bodyBg,
    data: seriesData[1],
    name: 'Download'
    }];

  $interval(function () {
    $scope.series = null;
    random.removeData(seriesData);
    random.addData(seriesData);

    $scope.series = [{
      data: seriesData[0],
        }, {
      data: seriesData[1],
        }];
  }, 1000);

  var seriesData2 = [[], [], []];
  var random2 = new Rickshaw.Fixtures.RandomData(100);

  for (var v = 0; v < 100; v++) {
    random2.addData(seriesData2);
  }

  $scope.options5 = {
    renderer: 'area',
    height: 133,
    padding: {
      top: 2, left: 0, right: 0, bottom: 0
    },
    interpolation: 'cardinal',
    stroke: false,
    strokeWidth: 1,
    preserve: true,
  };

  $scope.features5 = {

    hover: {
      xFormatter: function (x) {
        return new Date(x * 1000).toString();
      },
      yFormatter: function (y) {
        return Math.round(y);
      }
    }
  };

  $scope.series5 = [{
    color: COLORS.success,
    name: 'Earnings',
    data: seriesData2[0]
    }];

  $scope.dataTableOpt = {
    'ajax': 'data/datatables-arrays.json'
  };

  eosService.getGroups().success(function (response) {
      $scope.groups = response[0].group.ls;
      console.log('Groups');
      console.log(response[0]);
    });

  eosService.getFileSystems().success(function (response) {
      $scope.fileSystems = response[0].fs.ls;
      console.log('File Systems');
      console.log(response[0]);
    });

  eosService.getNodes().success(function (response) {
      $scope.nodes = response[0].node.ls;
      console.log('Groups');
      console.log(response[0]);
    });

  eosService.getSpaces().success(function (response) {
      $scope.spaces = response[0].space.ls;
      console.log('Groups');
      console.log(response[0]);
    });

  eosService.getVersion().success(function (response) {
      $scope.versionData = response[0];
      console.log('Version Details');
      console.log(response);
    });

  eosService.getNsStat().success(function (response) {
      $scope.NsStatData = response[0].ns.stat;
    });

  eosService.getSpaceStatus().success(function (response) {
      console.log('Space Status');
      console.log(response);
      $scope.SpaceStatusData = response[0];
    });

}

angular
  .module('urbanApp')
  .controller('dashboardCtrl', ['$scope', '$interval','eosService', 'COLORS', dashboardCtrl]);