'use strict';

function eosServiceAPI($http) {

  var eosAPI = {};

    eosAPI.getGroups = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/user/',
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
        url: 'http://eosservicetest2:8000/proc/user/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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
        url: 'http://eosservicetest2:8000/proc/admin/',
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

    return eosAPI;
}

angular
  .module('urbanApp')
  .factory('eosService', ['$http', eosServiceAPI]);
