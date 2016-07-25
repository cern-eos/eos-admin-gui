'use strict';

function eosServiceAPI($http) {

  var eosAPI = {};
    // var url_admin = 'http://eosservicetest2:8000/proc/admin/';
    // var url_user = 'http://eosservicetest2:8000/proc/user/';
    var url_admin = 'http://p05614910a92540.cern.ch:8000/proc/admin/';
    var url_user = 'http://p05614910a92540.cern.ch:8000/proc/user/';

    eosAPI.getGroups = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'group',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getFileSystems = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'fs',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getNodes = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'node',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getSpaces = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getVersion = function() {
      return $http({
        method: 'JSONP',
        url: url_user,
        params: {
          'mgm.cmd': 'version',
          'mgm.option': 'fm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getClientInfo = function() {
      return $http({
        method: 'JSONP',
        url: url_user,
        params: {
          'mgm.cmd': 'who',
          'mgm.option': 'sm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getNsStat = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'ns',
          'mgm.subcmd': 'stat',
          'mgm.option': 'm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getSpaceStatus = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'status',
          'mgm.space': 'default',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.setSpaceQuota = function(spacename, entity) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'quota',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK',
          'mgm.space.quota': entity
        }
      });
    };

    eosAPI.setSpaceConfig = function(spacename, key, value) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'config',
          'mgm.space.name': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK',
          'mgm.space.key': key,
          'mgm.space.value': value
        }
      });
    };

    eosAPI.getClusterInfo = function(infoType, spacename) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'node-get',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.format': 'fuse',
          'callback':'JSON_CALLBACK',
          'mgm.space.node-get.key': 'kinetic.' + infoType + '.default'
        }
      });
    };


    return eosAPI;
}

angular
  .module('urbanApp')
  .factory('eosService', ['$http', eosServiceAPI]);
